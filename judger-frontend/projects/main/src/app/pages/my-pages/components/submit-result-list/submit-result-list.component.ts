import { Location } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AbstractSearchDirective } from '../../../../classes/abstract-search.directive';
import { ERROR_CODES } from '../../../../constants/error-codes';
import { IContest } from '../../../../models/contest';
import { IParams } from '../../../../models/params';
import { IListResponse } from '../../../../models/response';
import { ISubmit } from '../../../../models/submit';
import { SubmitResultTypePipe } from '../../../../pipes/submit-result-pipe/submit-result-type.pipe';
import { ContestService } from '../../../../services/apis/contest.service';
import { SubmitService } from '../../../../services/apis/submit.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'sw-submit-result-list',
  templateUrl: './submit-result-list.component.html',
  styleUrls: ['./submit-result-list.component.scss'],
  providers: [SubmitResultTypePipe],
})
export class SubmitResultListComponent extends AbstractSearchDirective<ISubmit> {

  isRender: boolean = false;
  id: string;
  columns = [
    'no',
    'title',
    'language',
    'status',
    'createdAt',
  ];
  activateRoute: ActivatedRoute;
  private anchorEle: HTMLAnchorElement;
  contest: IContest;

  constructor(

    private submitService: SubmitService,
    public auth: AuthService,
    private contestService: ContestService,
    private result: SubmitResultTypePipe,
    private location: Location,
    injector: Injector
  ) {

    super({ limit: 10, sort: '-createdAt' }, ['user', 'language']);
    this.activateRoute = injector.get(ActivatedRoute);
    this.anchorEle = document.createElement('a');
  }

  protected requestObservable(
    params: IParams | undefined
  ): Observable<IListResponse<ISubmit>> {
    return this.submitService.getMySubmits(params);
  }

  changePage(event: PageEvent): void {
    this.limit = event.pageSize;
    super.pagination(event.pageIndex + 1);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.addSubscriptions(
      this.submitService.getMySubmits().subscribe(
        (res) => {(this.isRender = true)},
        (err) => {
          const { code } = (err && err.error) || {};
          switch (code) {
            case ERROR_CODES.FORBIDDEN:
              alert('권한이 없는 요청입니다.');
              break;
            default:
              alert((err.error && err.error.message) || err.message);
          }
        }
      )
    );

  }

  protected readonly alert = alert;

}
