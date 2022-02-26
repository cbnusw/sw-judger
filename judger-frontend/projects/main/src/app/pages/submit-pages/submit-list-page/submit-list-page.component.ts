import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IAssignment } from '../../../models/assignment';
import { IContest } from '../../../models/contest';
import { IProblem } from '../../../models/problem';
import { ISubmit } from '../../../models/submit';
import { AssignmentService } from '../../../services/apis/assignment.service';
import { ContestService } from '../../../services/apis/contest.service';
import { ProblemService } from '../../../services/apis/problem.service';
import { SubmitService } from '../../../services/apis/submit.service';
@Component({
  selector: 'sw-submit-list-page',
  templateUrl: './submit-list-page.component.html',
  styleUrls: ['./submit-list-page.component.scss'],
})
export class SubmitListPageComponent implements OnInit {
  private subscription: Subscription;

  contest: IContest;
  assignment: IAssignment;
  problem: IProblem;
  submits: ISubmit[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contestService: ContestService,
    private problemService: ProblemService,
    private assignmentService: AssignmentService,
    private submitService: SubmitService
  ) {}

  getSubmits(problemId?: string, contestId?: string, assignmentId?: string): void {
    if (assignmentId) {
      this.submitService.getMyAssignmentSubmits(assignmentId).subscribe((res) => (this.submits = res.data.documents));
    } else if (contestId) {
      this.submitService.getMyContestSubmits(contestId).subscribe((res) => (this.submits = res.data.documents));
    } else {
      this.submitService.getMyProblemSubmits(problemId).subscribe((res) => (this.submits = res.data.documents));
    }
  }

  ngOnInit(): void {
    const { contest, assignment, problem } = this.route.snapshot.queryParams;

    if (contest) {
      this.contestService.getContest(contest).subscribe((res) => (this.contest = res.data));
    }
    if (assignment) {
      this.assignmentService.getAssignment(assignment).subscribe((res) => (this.assignment = res.data));
    }
    this.problemService.getProblem(problem).subscribe((res) => (this.problem = res.data));

    if (contest) {
      this.getSubmits(problem, contest);
    }
    if (assignment) {
      this.getSubmits(problem, null, assignment);
    }
  }
}
