import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractSearchDirective } from '../../../../classes/abstract-search.directive';
import { IContest } from '../../../../models/contest';
import { IParams } from '../../../../models/params';
import { IListResponse } from '../../../../models/response';
import { ContestService } from '../../../../services/apis/contest.service';

@Component({
  selector: 'sw-progressing-contest-list',
  templateUrl: './progressing-contest-list.component.html',
  styleUrls: ['./progressing-contest-list.component.scss'],
  providers: [DatePipe]
})
export class ProgressingContestListComponent extends AbstractSearchDirective<IContest> {

  constructor(private contestService: ContestService) {
    super({});
  }

  protected requestObservable(params: IParams | undefined): Observable<IListResponse<IContest>> {
    return this.contestService.getProgressingContests();
  }
}
