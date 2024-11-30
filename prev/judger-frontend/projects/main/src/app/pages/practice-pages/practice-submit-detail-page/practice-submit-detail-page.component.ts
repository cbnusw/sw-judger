import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ISubmit } from '../../../models/submit';
import { PracticeService } from '../../../services/apis/practice.service';
import { AuthService } from '../../../services/auth.service';

import * as Prism from 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp.js';
import 'prismjs/components/prism-java.js';
import 'prismjs/components/prism-python.js';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-kotlin.js';
import 'prismjs/components/prism-go.js';


@Component({
  selector: 'sw-practice-submit-detail-page',
  templateUrl: './practice-submit-detail-page.component.html',
  styleUrls: ['./practice-submit-detail-page.component.scss']
})
export class PracticeSubmitDetailPageComponent implements OnInit {

  isRender: boolean = false;
  submit: ISubmit;
  subscription: Subscription;

  constructor(
    private auth: AuthService,
    private practiceService: PracticeService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.route.params.pipe(
      map(res => res.id),
      switchMap(id => this.practiceService.getPracticeSubmitsDetail(id))
    ).subscribe(
      res => {
        this.submit = res.data;
        this.isRender = true;
        switch (this.submit.language) {
          case 'c':
            this.submit.code = Prism.highlight(this.submit.code, Prism.languages.c, 'c');
            break;
          case 'c++':
            this.submit.code = Prism.highlight(this.submit.code, Prism.languages['cpp'], 'cpp');
            break;
          case 'java':
            this.submit.code = Prism.highlight(this.submit.code, Prism.languages.java, 'java');
            break;
          case 'python2':
            this.submit.code = Prism.highlight(this.submit.code, Prism.languages.python, 'python');
            break;
          case 'python3':
            this.submit.code = Prism.highlight(this.submit.code, Prism.languages.python, 'python');
            break;
          case 'javascript':
            this.submit.code = Prism.highlight(this.submit.code, Prism.languages.javascript, 'javascript');
            break;
          case 'kotlin':
            this.submit.code = Prism.highlight(this.submit.code, Prism.languages.kotlin, 'kotlin');
            break;
          case 'go':
            this.submit.code = Prism.highlight(this.submit.code, Prism.languages.go, 'go');
            break;
        }
      },
      err => {
        alert(`${(err.error && err.error.message) || err.message}`);
        this.location.back();
      }
    );
  }

}
