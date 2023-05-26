import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { AbstractSearchDirective } from '../../../classes/abstract-search.directive';
import { IAssignment } from '../../../models/assignment';
import { IParams } from '../../../models/params';
import { IListResponse } from '../../../models/response';
import { AssignmentService } from '../../../services/apis/assignment.service';

@Component({
  selector: 'sw-my-assignment-list-page',
  templateUrl: './my-assignment-list-page.component.html',
  styleUrls: ['./my-assignment-list-page.component.scss']
})
export class MyAssignmentListPageComponent extends AbstractSearchDirective<IAssignment> {

  columns = ['no', 'title', 'course', 'writer', 'testPeriod', 'createdAt'];
  limitOptions: number[] = [10, 25, 50, 100];
  @ViewChild(MatSort) sort: MatSort;

  constructor(private assignmentService: AssignmentService) { 
    super({ limit: 10, sort: '-createdAt' }, ['title','course']);
   }

   protected requestObservable(params: IParams | undefined): Observable<IListResponse<IAssignment>> {
     return this.assignmentService.searchMyAssignments(params);
   }

  changePage(event: PageEvent): void {
    this.limit = event.pageSize;
    super.pagination(event.pageIndex + 1);
  }

  // ngAfterViewInit(): void {
  //   this.addSubscriptions(
  //     this.sort.sortChange
  //       .subscribe(event => {
  //         this.params.sort = `${event.direction === 'asc' ? '' : '-'}${event.active}`;
  //         this.search(this.page);
  //       })
  //   );
  // }
}
