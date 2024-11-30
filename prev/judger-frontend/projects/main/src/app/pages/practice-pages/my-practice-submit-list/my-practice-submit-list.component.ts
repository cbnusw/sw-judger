import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { IProblem } from '../../../models/problem';
import { ISubmit } from '../../../models/submit';
import { PracticeService } from '../../../services/apis/practice.service';
import { SubmitService } from '../../../services/apis/submit.service';

@Component({
  selector: 'sw-my-practice-submit-list',
  templateUrl: './my-practice-submit-list.component.html',
  styleUrls: ['./my-practice-submit-list.component.scss']
})
export class MyPracticeSubmitListComponent implements OnInit {

  problem: IProblem;
  submits: any;

  constructor(
    private route: ActivatedRoute,
    private submitService: SubmitService,
    private practiceService: PracticeService
  ) {
  }

  ngOnInit(): void {
    const problem = this.route.snapshot.paramMap.get('id');
    this.practiceService.getMyPracticeSubmits(problem).subscribe((res) => {
      this.submits = res.data
    });
    this.practiceService.getPractice(problem).subscribe(res => this.problem = res.data);
  }
}
