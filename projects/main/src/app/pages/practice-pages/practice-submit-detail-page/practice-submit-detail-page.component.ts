import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ISubmit } from '../../../models/submit';
import { PracticeService } from '../../../services/apis/practice.service';
import { AuthService } from '../../../services/auth.service';

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
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.params.pipe(
      map(res => res.id),
      switchMap(id => this.practiceService.getPracticeSubmitsDetail(id))
    ).subscribe(
      res => {
        this.submit = res.data;
        this.isRender = true;
      },
      err =>  {
        alert(`${(err.error && err.error.message) || err.message}`);
        this.location.back();
      }
    );
  }

}
