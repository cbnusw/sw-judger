import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IContest } from '../../../models/contest';
import { ContestService } from '../../../services/apis/contest.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'sw-contest-detail-page',
  templateUrl: './contest-detail-page.component.html',
  styleUrls: ['./contest-detail-page.component.scss']
})
export class ContestDetailPageComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  contest: IContest;
  columns = ['no', 'name', 'department', 'email', 'phone'];

  constructor(private auth: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private contestService: ContestService) {
  }

  get isWriter$(): Observable<boolean> {
    return this.auth.me$.pipe(
      map(me => {
        if (me && this.contest) {
          return this.contest.writer._id === me._id;
        }
        return false;
      })
    );
  }

  get isContestant$(): Observable<boolean> {
    return this.auth.me$.pipe(
      map(me => {
        if (me && this.contest) {
          return this.contest.contestants.map(contestant => contestant._id).some(id => me._id === id);
        }
        return false;
      })
    );
  }

  get isApplyingPeriod(): boolean {
    if (this.contest) {
      const now = new Date();
      const { applyingPeriod, testPeriod } = this.contest;
      if (applyingPeriod) {
        const start = new Date(applyingPeriod.start);
        const end = new Date(applyingPeriod.end);
        return start.getTime() <= now.getTime() && now.getTime() <= end.getTime();
      } else if (testPeriod) {
        const start = new Date(testPeriod.start);
        return now.getTime() < start.getTime();
      }
    }
    return false;
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

  get isTestPeriod(): boolean {
    if (!this.contest) {
      return false;
    }

    const { testPeriod } = this.contest;
    const now = new Date();
    const start = new Date(testPeriod.start);
    const end = new Date(testPeriod.end);

    return start.getTime() <= now.getTime() && now.getTime() <= end.getTime();
  }

  get isAfterTestPeriod(): boolean {
    if (!this.contest) {
      return false;
    }

    const { testPeriod } = this.contest;
    const now = new Date();
    const end = new Date(testPeriod.end);

    return end.getTime() < now.getTime();
  }

  unenroll(): void {
    const yes = confirm('대회의 참가신청을 취소하시겠습니까?\n참가신청기간이 지났을 경우 다시 신청할 수 없습니다.');

    if (!yes) {
      return;
    }

    this.contestService.unenrollContest(this.contest._id).pipe(
      switchMap(() => this.contestService.getContest(this.contest._id))
    ).subscribe(
      res => {
        this.contest = res.data;
        alert('대회 참가신청을 취소하였습니다.');
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

    const yes = confirm('대회 참가신청을 하시겠습니까?');

    if (!yes) {
      return;
    }

    this.contestService.enrollContest(this.contest._id).pipe(
      switchMap(() => this.contestService.getContest(this.contest._id))
    ).subscribe(
      res => {
        this.contest = res.data;
        alert('대회 참가신청을 완료하였습니다.\n대회시간을 확인하고 해당 시간에 참가해주십시오.');
      },
      err => alert(`${err.error && err.error.message || err.message}`)
    );
  }

  removeContest(): void {
    const yes = confirm('대회를 삭제하시겠습니까?');

    if (!yes) {
      return;
    }

    this.contestService.removeContest(this.contest._id).subscribe(
      () => {
        alert('대회를 삭제하였습니다.');
        this.router.navigateByUrl('/contest/list/me');
      },
      err => alert(`${err.error && err.error.message || err.message}`)
    );
  }

  ngOnInit(): void {
    this.subscription = this.route.params.pipe(
      map(params => params.id),
      switchMap(id => this.contestService.getContest(id))
    ).subscribe(
      res => this.contest = res.data,
      err => {
        alert(`${err.error && err.error.message || err.message}`);
        this.router.navigateByUrl('/');
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
