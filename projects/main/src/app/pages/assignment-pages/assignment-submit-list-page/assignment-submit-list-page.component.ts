import { Component, Injector } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { AbstractSearchDirective } from '../../../classes/abstract-search.directive';
import { ISubmit } from '../../../models/submit';
import { IParams } from '../../../models/params';
import { SubmitService } from '../../../services/apis/submit.service';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs';
import { IListResponse } from '../../../models/response';
import { ActivatedRoute } from '@angular/router';
import { ERROR_CODES } from '../../../constants/error-codes';
import { AssignmentService } from '../../../services/apis/assignment.service';
import * as XLSX from 'xlsx';
import { IAssignment } from '../../../models/assignment';
import { formatDate } from '@angular/common';

@Component({
  selector: 'sw-assignment-submit-list-page',
  templateUrl: './assignment-submit-list-page.component.html',
  styleUrls: ['./assignment-submit-list-page.component.scss'],
})
export class AssignmentSubmitListPageComponent extends AbstractSearchDirective<ISubmit> {
  isRender: boolean = false;
  id: string;
  // done: boolean = false;
  columns = [
    'no',
    'number',
    'student',
    'language',
    'memory',
    'time',
    'status',
    'createdAt',
  ];
  activateRoute: ActivatedRoute;
  private anchorEle: HTMLAnchorElement;
  private assignment: IAssignment;

  constructor(
    private submitService: SubmitService,
    private auth: AuthService,
    private assignmentService: AssignmentService,
    injector: Injector
  ) {
    super({ limit: 10, sort: '-createdAt' }, ['no', 'name', 'language']);
    this.activateRoute = injector.get(ActivatedRoute);
    this.anchorEle = document.createElement('a');
  }

  protected requestObservable(
    params: IParams | undefined
  ): Observable<IListResponse<ISubmit>> {
    return this.submitService.getAssignmentSubmits(this.id, params);
  }

  downloadExcel(): void {
    if (
      !this.auth.isOperator &&
      this.assignment.writer !== (this.auth.me || {})._id
    ) {
      return;
    }

    const getExcelData = () => {
      const header = ['#', '학번', '이름', '언어', '메모리', '실행시간', '실행결과', '제출시간'];

      return [
        header,
        ...this.documents.map((doc, i) => [
          i + 1,
          doc.user.no,
          doc.user.name,
          doc.language,
          doc.result.memory / (1024 * 1024) + 'MB',
          doc.result.time + 'ms',
          doc.result.type,
          formatDate(doc.createdAt, 'yyyy/MM/dd, hh:mm a', 'en-US', '+0900'),
        ]),
      ];
    };

    const excelHandler = {
      getExcelFileName: () => `${this.assignment.course}_${this.assignment.title}_제출내역.xlsx`,
      getSheetName: () => '제출내역',
      getExcelData,
      getWorksSheet: () => XLSX.utils.aoa_to_sheet(getExcelData()),
    };

    const s2ab = (s: any) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        // tslint:disable-next-line:no-bitwise
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    };

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = excelHandler.getWorksSheet();
    XLSX.utils.book_append_sheet(wb, ws, excelHandler.getSheetName());
    const out = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    const blob = new Blob([s2ab(out)], {
      type: 'application/octet-stream',
    });
    this.anchorEle.href = URL.createObjectURL(blob);
    this.anchorEle.download = excelHandler.getExcelFileName();
    this.anchorEle.click();
  }

  // protected getDone(): void {
  //   if(this.done === true) {
  //     delete this.params.type;
  //     this.done = false;
  //     this.search()
  //   } else {
  //     this.params['type'] = 'done';
  //     this.done = true;
  //     this.search();
  //   }
  // }

  changePage(event: PageEvent): void {
    this.limit = event.pageSize;
    super.pagination(event.pageIndex + 1);
  }

  ngOnInit(): void {
    const { id } = this.activateRoute.snapshot.params;
    this.id = id;
    super.ngOnInit();
    this.addSubscriptions(
      this.submitService.getAssignmentSubmits(this.id).subscribe(
        (res) => (this.isRender = true),
        (err) => {
          const { code } = (err && err.error) || {};
          switch (code) {
            case ERROR_CODES.FORBIDDEN:
              alert('권한이 없는 요청입니다.');
              // this.router.navigateByUrl('/');
              break;
            default:
              alert((err.error && err.error.message) || err.message);
            // this.router.navigateByUrl('/');
          }
        }
      ),
      this.assignmentService.getAssignment(this.id).subscribe(
        res => this.assignment = res.data
      )
    );

  }
}
