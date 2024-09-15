import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PDFDocumentProxy } from 'ng2-pdf-viewer/public_api';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ERROR_CODES } from '../../../constants/error-codes';
import { IContest } from '../../../models/contest';
import { IProblem } from '../../../models/problem';
import { IAssignment } from '../../../models/assignment';
import { ContestService } from '../../../services/apis/contest.service';
import { ProblemService } from '../../../services/apis/problem.service';
import { AssignmentService } from '../../../services/apis/assignment.service';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'sw-problem-detail-page',
  templateUrl: './problem-detail-page.component.html',
  styleUrls: ['./problem-detail-page.component.scss'],
})
export class ProblemDetailPageComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  isLoading: boolean = true;
  contest: IContest;
  assignment: IAssignment;
  problem: IProblem;
  lastPage = 1;
  page = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private problemService: ProblemService,
    private contestService: ContestService,
    private assignmentService: AssignmentService,
    private cookieService: CookieService,
    private http: HttpClient // HttpClient 추가
  ) {
  }

  get isWriter(): boolean {
    if (!this.problem || !this.auth.me) {
      return false;
    }
    return this.problem.writer._id === this.auth.me._id;
  }

  get isStudent(): boolean {
    return this.auth.me.role === 'student';
  }

  get submitable(): boolean {
    const now = new Date();

    if (this.contest) {
      if (
        !this.contest.contestants.some(
          (contestant) => contestant._id === (this.auth.me && this.auth.me._id)
        )
      ) {
        return false;
      }

      const { testPeriod } = this.contest;
      const start = new Date(testPeriod.start);
      const end = new Date(testPeriod.end);
      return start.getTime() <= now.getTime() && now.getTime() <= end.getTime();
    }

    if (this.assignment) {
      const { testPeriod } = this.assignment;
      const start = new Date(testPeriod.start);
      const end = new Date(testPeriod.end);
      return start.getTime() <= now.getTime() && now.getTime() <= end.getTime();
    }

    return false;
  }

  // 예제 파일 다운로드 메서드 추가
  downloadExampleFile(file: any): void {
    const url = `http://localhost:4003/v1/problem/${file.ref}/example-files/${file._id}`; // Express 서버로 요청 보낼 URL
    const a = document.createElement('a');
    a.href = url;
    a.download = file.filename; // 다운로드될 파일 이름 설정
    a.click();
}


  loadPdf(e: PDFDocumentProxy): void {
    this.lastPage = (e as any)._pdfInfo.numPages;
  }

  prevPage(): void {
    this.page--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextPage(): void {
    this.page++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  editProblem(): void {
    if (this.contest) {
      this.router.navigate(['/problem/edit', this.problem._id], {
        queryParams: { contest: this.contest._id },
      });
    } else if (this.assignment) {
      this.router.navigate(['/problem/edit', this.problem._id], {
        queryParams: { assignment: this.assignment._id },
      });
    } else {
      this.router.navigate(['/problem/edit', this.problem._id]);
    }
  }

  removeProblem(): void {
    const yes = confirm('문제를 삭제하시겠습니까?');

    if (!yes) {
      return;
    }

    this.problemService.removeProblem(this.problem._id).subscribe(
      (res) => {
        if (this.contest) {
          this.router.navigate(['/contest', this.contest._id, 'problems']);
        } else if (this.assignment) {
          this.router.navigate(['/assignment', this.assignment._id, 'problems',
          ]);
        } else {
          this.router.navigateByUrl('/problem/list/me');
        }
      },
      (err) => alert(`${(err.error && err.error.message) || err.message}`)
    );
  }

  moveListPage(): void {
    if (this.contest) {
      this.router.navigate(['/contest', this.contest._id, 'problems']);
    } else if (this.assignment) {
      this.router.navigate(['/assignment', this.assignment._id, 'problems']);
    } else {
      this.router.navigateByUrl('/problem/list');
    }
  }

  mySubmitStatus(): void {
    const queryParams: Params = {};
    if (this.contest) {
      queryParams.contest = this.contest._id;
    }
    if (this.assignment) {
      queryParams.assignment = this.assignment._id;
    }
    if (this.problem) {
      queryParams.problem = this.problem._id;
    }
    this.router.navigate(['/submit/list'], { queryParams });
  }

  submitSource(): void {
    const queryParams: Params = {};
    let params;
    this.route.paramMap.subscribe((res) => {
      params = res;
    });
    if (this.contest) {
      queryParams.contest = this.contest._id;
    }
    if (this.assignment) {
      queryParams.assignment = this.assignment._id;
    }
    if (this.problem) {
      queryParams.problem = this.problem._id;
    }
    this.router.navigate(['/submit'], { queryParams });
  }

  ngOnInit(): void {
    let params: any;
    this.route.queryParams.subscribe((res) => {
      params = res;
    });
    this.subscription = this.route.params
      .pipe(
        map((params) => params.id),
        switchMap((id) => this.problemService.getProblem(id))
      )
      .subscribe(
        (res) => (this.problem = res.data),
        (err) => {
          alert(`오류가 발생했습니다.\n${err.error}`)
          this.router.navigateByUrl('/')
        }
      );

    if (params.contest) {
      this.subscription.add(
        this.route.queryParams
          .pipe(
            map((params) => params.contest),
            switchMap((id) => this.contestService.getContest(id))
          )
          .subscribe(
            res => {
              this.contest = res.data;
              if (this.contest.isPassword) {
                if (this.isWriter) {
                  this.isLoading = false;
                } else {
                  let password: string = this.cookieService.get(this.contest._id);
                  if (!password) password = prompt('비밀번호를 입력하세요');

                  this.contestService.confirmPassword(this.contest._id, password).subscribe(res => {
                      this.cookieService.set(this.contest._id, password, { expires: new Date(this.contest.testPeriod.end) });
                      this.isLoading = false;
                    },
                    err => {
                      const { code } = err && err.error || {};
                      switch (code) {
                        case ERROR_CODES.CONTEST_NOT_FOUND:
                          alert('찾을 수 없는 대회 문제입니다.');
                          this.router.navigate(['/contest/detail', this.contest._id]);
                          break;
                        case ERROR_CODES.CONTEST_PASSWORD_NOT_MATCH:
                          alert('비밀번호를 다시 입력해주세요');
                          this.cookieService.delete(this.contest._id);
                          this.router.navigate(['/contest/detail', this.contest._id]);
                          break;
                      }
                    }
                  )
                }
              }
            },
            err => {
              alert(`오류가 발생했습니다.\n${err.error}`)
              console.error(err)
            }
          )
      );
    }
    if (params.assignment) {
      this.subscription.add(
        this.route.queryParams
          .pipe(
            map((params) => params.assignment),
            switchMap((id) => this.assignmentService.getAssignment(id))
          )
          .subscribe(
            res => {
              this.assignment = res.data;
              this.isLoading = false;
            },
            err => {
              alert(`오류가 발생했습니다.\n${err.error}`)
              console.error(err)
            }
          )
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
