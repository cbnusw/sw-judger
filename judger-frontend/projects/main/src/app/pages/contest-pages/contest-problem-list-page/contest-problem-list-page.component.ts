import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ERROR_CODES } from '../../../constants/error-codes';
import { IContest } from '../../../models/contest';
import { IProblem } from '../../../models/problem';
import { ContestService } from '../../../services/apis/contest.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'sw-contest-problem-list-page',
  templateUrl: './contest-problem-list-page.component.html',
  styleUrls: ['./contest-problem-list-page.component.scss']
})
export class ContestProblemListPageComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  contest: IContest;
  orderableProblems: IProblem[];
  dragIndex = -1;

  constructor(private auth: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private contestService: ContestService) {
  }

  setReorderMode(): void {
    this.orderableProblems = [...this.contest.problems];
  }

  reorder(): void {
    this.contestService.reorderContestProblems(this.contest._id, this.orderableProblems).pipe(
      switchMap(() => this.contestService.getContestProblems(this.contest._id))
    ).subscribe(
      res => {
        this.contest = res.data;
        this.orderableProblems = null;
      }
    );
  }

  get isWriter$(): Observable<boolean> {
    return this.auth.me$.pipe(
      map(me => {
        if (me && this.contest) {
          return me._id === this.contest.writer._id;
        }
        return false;
      })
    );
  }

  drop(e: CdkDragDrop<IProblem, any>): void {
    moveItemInArray(this.orderableProblems, e.previousIndex, e.currentIndex);
  }

  moveScoreBoard(): void {
    this.router.navigate(['/scoreboard'], { queryParams: { contest: this.contest._id } });
  }

  get isBeforeTestPeriod(): boolean {
    if (!this.contest) {
      return false;
    }

    const { testPeriod } = this.contest;
    const now = new Date();
    const start = new Date(testPeriod.start);

    return now.getTime() < start.getTime();
  }

  ngOnInit(): void {
    this.subscription = this.route.params.pipe(
      map(params => params.id),
      switchMap(id => this.contestService.getContestProblems(id))
    ).subscribe(
      res => this.contest = res.data,
      err => {
        const { code } = err && err.error || {};
        switch (code) {
          case ERROR_CODES.CONTEST_NOT_FOUND:
            alert('찾을 수 없는 대회입니다.');
            this.router.navigateByUrl('/');
            break;
          case ERROR_CODES.IS_NOT_TEST_PERIOD:
            alert('대회 시간이 아닙니다.');
            this.router.navigate(['/contest/detail', this.route.snapshot.params.id]);
            break;
          case ERROR_CODES.IS_NOT_CONTESTANT:
            alert('대회 참가자가 아닙니다.');
            this.router.navigate(['/contest/detail', this.route.snapshot.params.id]);
            break;
          default:
            alert(err.error && err.error.message || err.message);
            this.router.navigateByUrl('/');
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
