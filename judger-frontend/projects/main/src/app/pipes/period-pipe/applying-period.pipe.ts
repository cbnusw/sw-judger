import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { IContest } from '../../models/contest';

@Pipe({
  name: 'applyingPeriod',
})
export class ApplyingPeriodPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {
  }

  transform(contest: IContest): string {
    const { applyingPeriod, testPeriod } = contest || {};
    const fmt = 'yyyy.MM.dd.';
    if (applyingPeriod) {
      return `${this.datePipe.transform(applyingPeriod.start, fmt)} ~ ${this.datePipe.transform(applyingPeriod.end, fmt)}`;
    } else if (testPeriod) {
      return `~ ${this.datePipe.transform(testPeriod.start, fmt + ' HH:mm')}`;
    }
    return '-';
  }

}
