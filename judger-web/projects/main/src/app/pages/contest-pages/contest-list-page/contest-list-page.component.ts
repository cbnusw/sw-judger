import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { AbstractSearchDirective } from '../../../classes/abstract-search.directive';
import { IContest } from '../../../models/contest';
import { IParams } from '../../../models/params';
import { IListResponse } from '../../../models/response';
import { ContestService } from '../../../services/apis/contest.service';

@Component({
  selector: 'sw-contest-list-page',
  templateUrl: './contest-list-page.component.html',
  styleUrls: ['./contest-list-page.component.scss']
})
export class ContestListPageComponent extends AbstractSearchDirective<IContest> {

  columns = ['no', 'title', 'applyingPeriod', 'testPeriod', 'writer', 'contestants', 'createdAt'];

  constructor(private contestService: ContestService) {
    super({ limit: 10, sort: '-createdAt' });
  }

  protected requestObservable(params: IParams | undefined): Observable<IListResponse<IContest>> {
    return this.contestService.search(params);
  }

  changePage(event: PageEvent): void {
    this.limit = event.pageSize;
    super.pagination(event.pageIndex + 1);
  }
}
