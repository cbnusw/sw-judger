import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import { IUserInfo } from '../../../../models/user-info';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'sw-contestants-list',
  templateUrl: './contestants-list.component.html',
  styleUrls: ['./contestants-list.component.scss']
})
export class ContestantsListComponent implements AfterViewInit, OnDestroy {

  private subscription: Subscription;
  private _contestants: IUserInfo[];
  private anchorEle: HTMLAnchorElement;

  columns = ['no', 'name', 'university' ,'department', 'email', 'phone'];
  @Input() contestTitle: string;
  @Input() contestWriter: string;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public auth: AuthService) {
    this.anchorEle = document.createElement('a');
  }

  @Input() set contestants(contestants: IUserInfo[]) {
    contestants = [...(contestants || [])];
    contestants.sort((a, b) => {
      if (a.no < b.no) {
        return -1;
      } else if (a.no > b.no) {
        return 1;
      } else {
        return 0;
      }
    });
    this._contestants = [...contestants];
  }

  get contestants(): IUserInfo[] {
    return this._contestants;
  }

  downloadExcel(): void {
    if (!this.auth.isOperator && this.contestWriter !== (this.auth.me || {})._id) {
      return;
    }

    const getExcelData = () => {
      const header = ['#', '학번', '이름', '소속대학' ,'소속학과', '이메일', '연락처'];

      return [header, ...this.contestants.map((contestant, i) => [
        i + 1, contestant.no, contestant.name, contestant.university ,contestant.department, contestant.email, contestant.phone
      ])];
    };

    const excelHandler = {
      getExcelFileName: () => `${this.contestTitle}_참가자.xlsx`,
      getSheetName: () => '대회 참가자',
      getExcelData,
      getWorksSheet: () => XLSX.utils.aoa_to_sheet(getExcelData())
    };

    const s2ab = (s: any) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        // tslint:disable-next-line:no-bitwise
        view[i] = s.charCodeAt(i) & 0xFF;
      }
      return buf;
    };

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = excelHandler.getWorksSheet();
    XLSX.utils.book_append_sheet(wb, ws, excelHandler.getSheetName());
    const out = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    const blob = new Blob([s2ab(out)], { type: 'application/octet-stream' });
    this.anchorEle.href = URL.createObjectURL(blob);
    this.anchorEle.download = excelHandler.getExcelFileName();
    this.anchorEle.click();
  }

  ngAfterViewInit(): void {

    this.subscription = this.sort.sortChange
      .subscribe(event => {
        const { direction, active } = event;
        this._contestants.sort((a, b) => {
          if (direction === 'asc') {
            if (a[active] < b[active]) {
              return -1;
            } else if (a[active] > b[active]) {
              return 1;
            } else {
              return 0;
            }
          } else if (direction === 'desc') {
            if (a[active] > b[active]) {
              return -1;
            } else if (a[active] < b[active]) {
              return 1;
            } else {
              return 0;
            }
          } else {
            return 0;
          }
        });
        this._contestants = [...this._contestants];
      });
  }

  ngOnDestroy(): void {
  }
}
