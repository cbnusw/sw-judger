import { Component } from '@angular/core';
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
  columns = ['no', 'course', 'title', 'writer', 'testPeriod'];

  constructor(private assignmentService: AssignmentService) {
    super({ limit: 10, sort: '-createdAt' }, ['title', 'course', 'writer']);
  }

  protected requestObservable(
    params: IParams | undefined
  ): Observable<IListResponse<IAssignment>> {
    return this.assignmentService.getAssignments(params);
  }

  changePage(event: PageEvent): void {
    this.limit = event.pageSize;
    super.pagination(event.pageIndex + 1);
  }
}
