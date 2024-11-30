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
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'sw-contest-problem-list-page',
  templateUrl: './contest-problem-list-page.component.html',
  styleUrls: ['./contest-problem-list-page.component.scss'],
})
export class ContestProblemListPageComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  isLoading: boolean = true;

  contest: IContest;
  isWriter: boolean;
  orderableProblems: IProblem[];

  dragIndex = -1;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private contestService: ContestService,
    private cookieService: CookieService
  ) {}

  setReorderMode(): void {
    this.orderableProblems = [...this.contest.problems];
  }

  reorder(): void {
    this.contestService
      .reorderContestProblems(this.contest._id, this.orderableProblems)
      .pipe(
        switchMap(() =>
          this.contestService.getContestProblems(this.contest._id)
        )
      )
      .subscribe((res) => {
        this.contest = res.data;
        this.orderableProblems = null;
      });
  }

  get isWriter$(): Observable<boolean> {
    return this.auth.me$.pipe(
      map((me) => {
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
    this.router.navigate(['/scoreboard'], {
      queryParams: { contest: this.contest._id },
    });
  }
  exitContest(): void {
    const confirmExit = confirm(
      '이 대회에서 나가시겠습니까? 이 대회에 다시 참가할 수 없습니다.'
    );

    if (confirmExit) {
      this.contestService.exitContest(this.contest._id).subscribe({
        next: () => {
          alert('성공적으로 대회에서 나왔습니다.');
          this.router.navigateByUrl('/'); // 사용자를 메인 페이지로 리디렉션
        },
        error: (err) => {
          alert(
            `오류 발생: ${(err.error && err.error.message) || err.message}`
          );
        },
      });
    }
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
    this.subscription = this.route.params
      .pipe(
        map((params) => params.id),
        switchMap((id) => this.contestService.getContestProblems(id))
      )
      .subscribe(
        (res) => {
          this.contest = res.data;
          if (this.contest.isPassword) {
            this.isWriter$.subscribe((res) => {
              this.isWriter = res;
              if (this.isWriter) {
                this.isLoading = false;
              } else {
                let password: string = this.cookieService.get(this.contest._id);
                if (!password) password = prompt('비밀번호를 입력하세요');

                this.contestService
                  .confirmPassword(this.contest._id, password)
                  .subscribe(
                    (res) => {
                      this.cookieService.set(this.contest._id, password, {
                        expires: new Date(this.contest.testPeriod.end),
                      });
                      this.isLoading = false;
                    },
                    (err) => {
                      const { code } = (err && err.error) || {};
                      switch (code) {
                        case ERROR_CODES.CONTEST_NOT_FOUND:
                          alert('찾을 수 없는 대회 문제입니다.');
                          this.router.navigate([
                            '/contest/detail',
                            this.contest._id,
                          ]);
                          break;
                        case ERROR_CODES.CONTEST_PASSWORD_NOT_MATCH:
                          alert('비밀번호를 다시 입력해주세요.');
                          this.cookieService.delete(this.contest._id);
                          this.router.navigate([
                            '/contest/detail',
                            this.contest._id,
                          ]);
                          break;
                        case ERROR_CODES.OUT_CONTEST:
                          alert('이미 나간 대회 입니다.');
                          this.router.navigate([
                            '/contest/detail',
                            this.contest._id,
                          ]);
                          break;
                      }
                    }
                  );
              }
            });
          }
        },
        (err) => {
          const { code } = (err && err.error) || {};
          switch (code) {
            case ERROR_CODES.CONTEST_NOT_FOUND:
              alert('찾을 수 없는 대회입니다.');
              this.router.navigateByUrl('/');
              break;
            case ERROR_CODES.IS_NOT_TEST_PERIOD:
              alert('대회 시간이 아닙니다.');
              this.router.navigate(['/contest/detail', this.contest._id]);
              break;
            case ERROR_CODES.IS_NOT_CONTESTANT:
              alert('대회 참가자가 아닙니다.');
              this.router.navigate(['/contest/detail', this.contest._id]);
              break;
            default:
              alert((err.error && err.error.message) || err.message);
              this.router.navigateByUrl('/');
          }
        }
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
