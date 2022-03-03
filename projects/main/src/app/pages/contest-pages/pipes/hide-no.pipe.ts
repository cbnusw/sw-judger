import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Pipe({
  name: 'hideNo'
})
export class HideNoPipe implements PipeTransform {

  constructor(private auth: AuthService) {
  }

  transform(no: string, userId: string, writerId: string): string {
    if (this.auth.me && (this.auth.isOperator || this.auth.me._id === userId || this.auth.me._id === writerId)) {
      return no;
    }

    if (/^\d{10}$/.test(no)) {
      return String(no.substr(0, 4)).padEnd(9, '*') + no[no.length - 1];
    }

    const length = no.length;
    return String(no.substr(0, Math.floor((length - 1) / 2))).padEnd(length - 1, '*') + no[length - 1];
  }
}
