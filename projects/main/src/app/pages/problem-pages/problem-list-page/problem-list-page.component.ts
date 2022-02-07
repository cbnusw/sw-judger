import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { AbstractSearchDirective } from '../../../classes/abstract-search.directive';
import { IParams } from '../../../models/params';
import { IProblem } from '../../../models/problem';
import { IListResponse } from '../../../models/response';
import { ProblemService } from '../../../services/apis/problem.service';

@Component({
  selector: 'sw-problem-list-page',
  templateUrl: './problem-list-page.component.html',
  styleUrls: ['./problem-list-page.component.scss'],
})
export class ProblemListPageComponent extends AbstractSearchDirective<IProblem> {
  columns = ['no', 'title', 'writer', 'createdAt'];

  constructor(private problemService: ProblemService) {
    super({ limit: 10, sort: '-createdAt' });
  }

  protected requestObservable(params: IParams | undefined): Observable<IListResponse<IProblem>> {
    return this.problemService.getProblems(params);
  }

  changePage(event: PageEvent): void {
    this.limit = event.pageSize;
    super.pagination(event.pageIndex + 1);
  }
}
