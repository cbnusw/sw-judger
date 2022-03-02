import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IAssignment } from '../../../models/assignment';
import { IContest } from '../../../models/contest';
import { IProblem } from '../../../models/problem';
import { ISubmit } from '../../../models/submit';
import { ProblemService } from '../../../services/apis/problem.service';
import { SubmitService } from '../../../services/apis/submit.service';
@Component({
  selector: 'sw-submit-list-page',
  templateUrl: './submit-list-page.component.html',
  styleUrls: ['./submit-list-page.component.scss'],
})
export class SubmitListPageComponent implements OnInit {

  contest: IContest;
  assignment: IAssignment;
  problem: IProblem;
  submits: ISubmit[];

  constructor(
    private route: ActivatedRoute,
    private problemService: ProblemService,
    private submitService: SubmitService
  ) {}

  ngOnInit(): void {
    const { problem } = this.route.snapshot.queryParams;
    this.submitService.getMyProblemSubmits(problem).subscribe(res => {this.submits = res.data.documents})
    this.problemService.getProblem(problem).subscribe((res) => (this.problem = res.data));
  }
}
