import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IAssignment } from '../../../models/assignment';
import { AssignmentService } from '../../../services/apis/assignment.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'sw-assignment-detail-page',
  templateUrl: './assignment-detail-page.component.html',
  styleUrls: ['./assignment-detail-page.component.scss'],
})

export class AssignmentDetailPageComponent implements OnInit{

  @HostBinding('class.hidden') hidden = true;

  assignment: IAssignment;
  pwInput: string;
  columns = ['no', 'name', 'department', 'email', 'phone'];

  private subscription: Subscription;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private assignmentService: AssignmentService,
  ) {}

  get isWriter$(): boolean {
    return this.assignment?.writer._id === this.auth.me?._id;
  }

  get isStudent(): boolean {
    return (this.auth.me?.role === "student");
  }

  get isContestant(): boolean {
      return this.assignment?.students.map(student => student._id).includes(this.auth.me?._id)
  }

  get isBeforeTestPeriod(): boolean {
    if (!this.assignment) {
      return false;
    }

    const { testPeriod } = this.assignment;
    const now = new Date();
    const start = new Date(testPeriod.start);

    return now.getTime() < start.getTime();
  }

  get isTestPeriod(): boolean {
    if (!this.assignment) {
      return false;
    }

    const { testPeriod } = this.assignment;
    const now = new Date();
    const start = new Date(testPeriod.start);
    const end = new Date(testPeriod.end);

    return start.getTime() <= now.getTime() && now.getTime() <= end.getTime();
  }

  get isAfterTestPeriod(): boolean {
    if (!this.assignment) {
      return false;
    }

    const { testPeriod } = this.assignment;
    const now = new Date();
    const end = new Date(testPeriod.end);

    return end.getTime() < now.getTime();
  }

  unenroll(): void {
    const yes = confirm('과제 참여를 취소하시겠습니까?');

    if (!yes) {
      return;
    }

    this.assignmentService.unenrollAssignment(this.assignment._id).pipe(
      switchMap(() => this.assignmentService.getAssignment(this.assignment._id))
    ).subscribe(
      res => {
        this.assignment = res.data;
        alert('과제 참여를 취소하였습니다.');
      },
      err => {
        alert(`${err.error && err.error.message || err.messasge}`);
      }
    );
  }

  enroll(): void {
    if (!this.auth.loggedIn) {
      alert('로그인이 필요합니다.');
      this.router.navigateByUrl('/account/login');
      return;
    }

    const yes = confirm('과제에 참여하시겠습니까?');

    if (!yes) {
      return;
    }

    this.assignmentService.enrollAssignment(this.assignment._id).pipe(
      switchMap(() => this.assignmentService.getAssignment(this.assignment._id))
    ).subscribe(
      res => {
        this.assignment = res.data;
        alert('과제에 참여하셨습니다.\n과제 제출기한을 준수해주세요.');
      },
      err => alert(`${err.error && err.error.message || err.message}`)
    );
  }

  removeAssignment(): void {
    const yes = confirm('과제를 삭제하시겠습니까? \n이 작업은 되돌릴 수 없습니다.');

    if (!yes) {
      return;
    }

    this.assignmentService.removeAssignment(this.assignment._id).subscribe(
      () => {
        alert('과제를 삭제하였습니다.');
        this.router.navigateByUrl('/assignment/list');
      },
      (err) => alert(`${(err.error && err.error.message) || err.message}`)
    );
  }

  ngOnInit(): void {
    this.subscription = this.route.params
      .pipe(
        map((params) => params.id),
        switchMap((id) => this.assignmentService.getAssignment(id)),
      )
      .subscribe(
        (res) => {
          this.assignment = res.data
          this.auth.me$.subscribe(res => {
            switch(res?._id) {
              case this.assignment.writer._id:
                this.pwInput = this.assignment.password;
                break;
              case (this.assignment.students.map(student => student._id).includes(res._id) ? res._id : ""):
                this.pwInput = this.assignment.password;
                break;
              default:
                this.pwInput= prompt('비밀번호를 입력하시오')
            }
            if (this.assignment.password !== this.pwInput) {
              alert(`비밀번호가 틀렸습니다`);
              this.router.navigateByUrl(`/assignment/list`);
            }
            this.hidden = false;
           }
          )
        },
        (err) => {
          alert(`${(err.error && err.error.message) || err.message}`);
          this.router.navigateByUrl('/');
        }
      )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
