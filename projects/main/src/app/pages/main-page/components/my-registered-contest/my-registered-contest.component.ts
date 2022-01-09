import { Component } from '@angular/core';
import { IParams } from 'projects/main/src/app/models/params';
import { IListResponse } from 'projects/main/src/app/models/response';
import { Observable } from 'rxjs';
import { AbstractSearchDirective } from '../../../../classes/abstract-search.directive';
import { IContest } from '../../../../models/contest';
import { ContestService } from '../../../../services/apis/contest.service';

@Component({
  selector: 'sw-my-registered-contest',
  templateUrl: './my-registered-contest.component.html',
  styleUrls: ['./my-registered-contest.component.scss']
})
export class MyRegisteredContestComponent extends AbstractSearchDirective<IContest> {

  constructor(private contestService: ContestService) {
    super({ limit: 5, sort: '-createdAt' });
  }

  protected requestObservable(params: IParams | undefined): Observable<IListResponse<IContest>> {
    return this.contestService.getRegisteredContests();
  }
}
