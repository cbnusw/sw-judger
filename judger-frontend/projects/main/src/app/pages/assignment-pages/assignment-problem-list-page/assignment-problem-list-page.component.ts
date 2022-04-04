import { Component, OnDestroy, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IAssignment } from '../../../models/assignment';
import { ERROR_CODES } from '../../../constants/error-codes';
import { IProblem } from '../../../models/problem';
import { AssignmentService } from '../../../services/apis/assignment.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'sw-assignment-problem-list-page',
  templateUrl: './assignment-problem-list-page.component.html',
  styleUrls: ['./assignment-problem-list-page.component.scss'],
})
export class AssignmentProblemListPageComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  assignment: IAssignment;
  orderableProblems: IProblem[];
  dragIndex = -1;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private assignmentService: AssignmentService
  ) {}

  setReorderMode(): void {
    this.orderableProblems = [...this.assignment.problems];
  }

  reorder(): void {
    this.assignmentService
      .reorderAssignmentProblems(this.assignment._id, this.orderableProblems)
      .pipe(switchMap(() => this.assignmentService.getAssignmentProblems(this.assignment._id)))
      .subscribe((res) => {
        this.assignment = res.data;
        this.orderableProblems = null;
      });
  }

  get isWriter$(): Observable<boolean> {
    return this.auth.me$.pipe(
      map((me) => {
        if (me && this.assignment) {
          return me._id === this.assignment.writer._id;
        }
        return false;
      })
    );
  }

  drop(e: CdkDragDrop<IProblem, any>): void {
    moveItemInArray(this.orderableProblems, e.previousIndex, e.currentIndex);
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

  ngOnInit(): void {
    this.subscription = this.route.params
      .pipe(
        map((params) => params.id),
        switchMap((id) => this.assignmentService.getAssignmentProblems(id))
      )
      .subscribe(
        (res) => (this.assignment = res.data),
        (err) => {
          const { code } = (err && err.error) || {};
          switch (code) {
            case ERROR_CODES.CONTEST_NOT_FOUND:
              alert('찾을 수 없는 과제입니다.');
              this.router.navigateByUrl('/');
              break;
            case ERROR_CODES.IS_NOT_TEST_PERIOD:
              alert('과제 시간이 아닙니다.');
              this.router.navigate(['/assignment/detail', this.route.snapshot.params.id]);
              break;
            case ERROR_CODES.IS_NOT_CONTESTANT:
              alert('과제 참여자가 아닙니다.');
              this.router.navigate(['/assignment/detail', this.route.snapshot.params.id]);
              break;
            default:
              alert((err.error && err.error.message) || err.message);
              this.router.navigateByUrl('/');
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
