import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { IContest } from '../../models/contest';

@Pipe({
  name: 'testPeriod'
})
export class TestPeriodPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {
  }

  transform(contest: IContest): string {
    const { testPeriod } = contest || {};
    const fmt = 'yyyy.MM.dd. HH:mm';

    if (testPeriod) {
      return `${this.datePipe.transform(testPeriod.start, fmt)} ~ ${this.datePipe.transform(testPeriod.end, fmt)}`;
    }

    return '-';
  }

}
