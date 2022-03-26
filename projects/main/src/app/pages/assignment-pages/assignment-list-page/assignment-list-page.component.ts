import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { AbstractSearchDirective } from '../../../classes/abstract-search.directive';
import { IAssignment } from '../../../models/assignment';
import { IParams } from '../../../models/params';
import { IListResponse } from '../../../models/response';
import { AssignmentService } from '../../../services/apis/assignment.service';

@Component({
  selector: 'sw-assignment-list-page',
  templateUrl: './assignment-list-page.component.html',
  styleUrls: ['./assignment-list-page.component.scss'],
})
export class AssignmentListPageComponent extends AbstractSearchDirective<IAssignment> {
  columns = ['no', 'title', 'course', 'writer', 'testPeriod', 'createdAt'];

  constructor(private AssignmentService: AssignmentService) {
    super({ limit: 10, sort: '-createdAt' });
  }

  protected requestObservable(
    params: IParams | undefined
  ): Observable<IListResponse<IAssignment>> {
    return this.AssignmentService.getAssignments(params);
  }

  changePage(event: PageEvent): void {
    this.limit = event.pageSize;
    super.pagination(event.pageIndex + 1);
  }
}
