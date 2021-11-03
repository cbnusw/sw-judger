import { Pipe, PipeTransform } from '@angular/core';
import { interval, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

const D_SEC = 24 * 60 * 60;
const H_SEC = 60 * 60;
const M_SEC = 60;

@Pipe({
  name: 'restTime'
})
export class RestTimePipe implements PipeTransform {

  transform(date: Date | string): Observable<string> {
    if (!date) {
      return of('');
    }

    if (typeof date === 'string') {
      date = new Date(date);
    }

    return interval().pipe(
      map(() => {
        const now = new Date();
        const rest = Math.floor(((date as Date).getTime() - now.getTime()) / 1000);
        if (rest >= 0) {
          const day = Math.floor(rest / D_SEC);
          const hours = Math.floor(rest % D_SEC / H_SEC);
          const minutes = Math.floor(rest % H_SEC / M_SEC);
          const seconds = Math.floor(rest % M_SEC);
          if (day > 0) {
            return `${day}일`;
          } else if (hours > 0) {
            return `${hours}시간 ${minutes}분`;
          } else if (minutes > 0) {
            return `${minutes}분 ${seconds}초`;
          } else {
            return `${seconds}초`;
          }
        }
        return '';
      })
    );
  }

}
