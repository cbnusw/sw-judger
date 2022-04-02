import { Component, OnInit } from '@angular/core';
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
export class AssignmentDetailPageComponent implements OnInit {
  private subscription: Subscription;

  assignment: IAssignment;
  columns = ['no', 'name', 'department', 'email', 'phone'];

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private assignmentService: AssignmentService
  ) {}

  get isWriter$(): Observable<boolean> {
    return this.auth.me$.pipe(
      map((me) => {
        if (me && this.assignment) {
          return this.assignment.writer._id === me._id;
        }
        return false;
      })
    );
  }

  get isStudent(): Observable<boolean> {
    return this.auth.me$.pipe(
      map((me) => {
        if(me.role === "student") return true;
        else return false;
      })
    );
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
        switchMap((id) => this.assignmentService.getAssignment(id))
      )
      .subscribe(
        (res) => (this.assignment = res.data),
        (err) => {
          alert(`${(err.error && err.error.message) || err.message}`);
          this.router.navigateByUrl('/');
        }
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
