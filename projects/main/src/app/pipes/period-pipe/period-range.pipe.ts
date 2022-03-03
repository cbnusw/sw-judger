import { Pipe, PipeTransform } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export enum EPeriodRange {BEFORE_PERIOD = -1, IN_PERIOD = 0, AFTER_PERIOD = 1}

export interface IPeriod {
  start: Date | string;
  end: Date | string;
}

@Pipe({
  name: 'periodRange'
})
export class PeriodRangePipe implements PipeTransform {

  transform(period: IPeriod): Observable<EPeriodRange> {
    if (!period) {
      return null;
    }
    const start = typeof period.start === 'string' ? new Date(period.start) : period.start;
    const end = typeof period.end === 'string' ? new Date(period.end) : period.end;

    return interval().pipe(
      map(() => {
        const now = new Date();
        if (now.getTime() < start.getTime()) {
          return EPeriodRange.BEFORE_PERIOD;
        } else if (now.getTime() > end.getTime()) {
          return EPeriodRange.AFTER_PERIOD;
        } else {
          return EPeriodRange.IN_PERIOD;
        }
      })
    );
  }

}
