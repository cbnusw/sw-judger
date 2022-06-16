import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  problem: IProblem;
  submits: ISubmit[];
  queryParams: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private problemService: ProblemService,
    private submitService: SubmitService
  ) {}


  ngOnInit(): void {
    const { problem } = this.route.snapshot.queryParamMap['params'];
    this.submitService.getMyProblemSubmits(problem).subscribe((res) => {
      this.submits = res.data.documents;
    });
    this.problemService.getProblem(problem).subscribe((res) => {
      this.problem = res.data;
      const { parentType, parentId } = res.data;
      this.queryParams = {};
      this.queryParams[parentType.toLowerCase()] = parentId['_id'];
    });
  }
}
