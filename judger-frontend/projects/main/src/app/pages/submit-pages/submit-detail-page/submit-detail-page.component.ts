import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SubmitService } from '../../../services/apis/submit.service';
import { Subscription } from 'rxjs';
import { ISubmit } from '../../../models/submit';
import { map,switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'sw-submit-detail-page',
  templateUrl: './submit-detail-page.component.html',
  styleUrls: ['./submit-detail-page.component.scss']
})
export class SubmitDetailPageComponent implements OnInit {

  isRender: boolean = false;
  submit: ISubmit;
  subscription: Subscription;

  constructor(
    private auth: AuthService,
    private submitService: SubmitService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.params.pipe(
      map(res => res.id),
      switchMap(id => this.submitService.getSubmit(id))
    ).subscribe(
      res => {
        this.submit = res.data,
        this.isRender = true;
      },
      err =>  {
        alert(`${(err.error && err.error.message) || err.message}`);
        this.location.back();
      }
    );
  }

}
