import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { AbstractSearchDirective } from '../../../classes/abstract-search.directive';
import { IParams } from '../../../models/params';
import { IProblem } from '../../../models/problem';
import { IListResponse } from '../../../models/response';
import { PracticeService } from '../../../services/apis/practice.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'sw-practice-list-page',
  templateUrl: './practice-list-page.component.html',
  styleUrls: ['./practice-list-page.component.scss']
})
export class PracticeListPageComponent extends AbstractSearchDirective<IProblem> {
  columns = ['no', 'title', 'writer', 'score'];

  constructor(
    public authService: AuthService,
    private practiceService: PracticeService
  ) {
    super({ limit: 10, sort: '-createdAt'}, ['title', 'writer']);
  }

  protected requestObservable(params: IParams | undefined): Observable<IListResponse<IProblem>> {
    return this.practiceService.search(params);
  }

  changePage(event: PageEvent): void {
    this.limit = event.pageSize;
    super.pagination(event.pageIndex + 1);
  }

}
