import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IContest } from '../../../models/contest';
import { IProblem } from '../../../models/problem';
import { ISubmit } from '../../../models/submit';
import { ContestService } from '../../../services/apis/contest.service';
import { ProblemService } from '../../../services/apis/problem.service';
import { SubmitService } from '../../../services/apis/submit.service';
import { SocketService } from '../../../services/socket.service';

@Component({
  selector: 'sw-submit-list-page',
  templateUrl: './submit-list-page.component.html',
  styleUrls: ['./submit-list-page.component.scss']
})
export class SubmitListPageComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  contest: IContest;
  problem: IProblem;

  submits: ISubmit[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private socketService: SocketService,
              private contestService: ContestService,
              private problemService: ProblemService,
              private submitService: SubmitService) {
  }

  getSubmits(problemId?: string, contestId?: string): void {
    if (problemId) {
      this.submitService.getMyProblemSubmits(problemId).subscribe(
        res => this.submits = res.data.documents
      );
    } else if (contestId) {
      this.submitService.getMyContestSubmits(contestId).subscribe(
        res => this.submits = res.data.documents
      );
    }
  }

  ngOnInit(): void {
    const { contest, problem } = this.route.snapshot.queryParams;

    if (contest) {
      this.contestService.getContest(contest).subscribe(res => this.contest = res.data);
    }

    if (problem) {
      this.problemService.getProblem(problem).subscribe(res => this.problem = res.data);
    }
    this.getSubmits(problem, contest);

    this.subscription = this.socketService.myResult$.subscribe(
      () => this.getSubmits(problem, contest)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
