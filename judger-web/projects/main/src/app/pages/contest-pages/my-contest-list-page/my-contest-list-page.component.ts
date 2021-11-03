import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { AbstractSearchDirective } from '../../../classes/abstract-search.directive';
import { IContest } from '../../../models/contest';
import { IParams } from '../../../models/params';
import { IListResponse } from '../../../models/response';
import { ContestService } from '../../../services/apis/contest.service';

@Component({
  selector: 'sw-my-contest-list-page',
  templateUrl: './my-contest-list-page.component.html',
  styleUrls: ['./my-contest-list-page.component.scss'],
  providers: [DatePipe]
})
export class MyContestListPageComponent extends AbstractSearchDirective<IContest> implements AfterViewInit {

  columns = ['no', 'title', 'testPeriod', 'applyingPeriod', 'writer', 'contestants', 'createdAt'];
  limitOptions: number[] = [10, 25, 50, 100];
  @ViewChild(MatSort) sort: MatSort;

  constructor(private contestService: ContestService) {
    super({ limit: 10, sort: '-createdAt' }, ['title']);
  }

  protected requestObservable(params: IParams | undefined): Observable<IListResponse<IContest>> {
    return this.contestService.searchMyContests(params);
  }

  changePage(event: PageEvent): void {
    this.limit = event.pageSize;
    super.pagination(event.pageIndex + 1);
  }

  ngAfterViewInit(): void {
    this.addSubscriptions(
      this.sort.sortChange
        .subscribe(event => {
          this.params.sort = `${event.direction === 'asc' ? '' : '-'}${event.active}`;
          this.search(this.page);
        })
    );
  }
}
