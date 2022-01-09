import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PDFDocumentProxy } from 'ng2-pdf-viewer/public_api';
import { error } from 'protractor';
import { Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IContest } from '../../../models/contest';
import { IProblem } from '../../../models/problem';
import { ContestService } from '../../../services/apis/contest.service';
import { ProblemService } from '../../../services/apis/problem.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'sw-problem-detail-page',
  templateUrl: './problem-detail-page.component.html',
  styleUrls: ['./problem-detail-page.component.scss']
})
export class ProblemDetailPageComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  contest: IContest;
  problem: IProblem;
  lastPage = 1;
  page = 1;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private auth: AuthService,
              private problemService: ProblemService,
              private contestService: ContestService) {
  }

  get isWriter(): boolean {
    if (!this.problem || !this.auth.me) {
      return false;
    }
    return this.problem.writer._id === this.auth.me._id;
  }

  get submitable(): boolean {
    const now = new Date();

    if (this.contest) {
      if (!this.contest.contestants.some(contestant => contestant._id === (this.auth.me && this.auth.me._id))) {
        return false;
      }

      const { testPeriod } = this.contest;
      const start = new Date(testPeriod.start);
      const end = new Date(testPeriod.end);

      return start.getTime() <= now.getTime() && now.getTime() <= end.getTime();
    }

    if (this.problem) {
      return this.problem.published && new Date(this.problem.published).getTime() < now.getTime();
    }

    return false;
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
      this.router.navigate(['/problem/edit', this.problem._id], { queryParams: { contest: this.contest._id } });
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
      res => {
        if (this.contest) {
          this.router.navigate(['/contest', this.contest._id, 'problems']);
        } else {
          this.router.navigateByUrl('/problem/list/me');
        }
      },
      err => alert(`${err.error && err.error.message || err.message}`)
    );
  }

  moveListPage(): void {
    if (this.contest) {
      this.router.navigate(['/contest', this.contest._id, 'problems']);
    } else {
      this.router.navigateByUrl('/problem/list');
    }
  }

  mySubmitStatus(): void {
    const queryParams: Params = {};
    if (this.contest) {
      queryParams.contest = this.contest._id;
    }
    if (this.problem) {
      queryParams.problem = this.problem._id;
    }
    this.router.navigate(['/submit/list'], { queryParams });
  }

  submitSource(): void {
    const queryParams: Params = {};
    if (this.contest) {
      queryParams.contest = this.contest._id;
    }

    if (this.problem) {
      queryParams.problem = this.problem._id;
    }

    this.router.navigate(['/submit'], { queryParams });
  }



  ngOnInit(): void {
    this.subscription = this.route.params.pipe(
      map(params => params.id),
      switchMap(id => this.problemService.getProblem(id))
    ).subscribe(
      res => this.problem = res.data,
      err => {
      }
    );

    this.subscription.add(
      this.route.queryParams.pipe(
        map(params => params.contest),
        switchMap(id => this.contestService.getContest(id)),
      ).subscribe(
        res => this.contest = res.data,
        err => {
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
