import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Pipe({
  name: 'hidePhone'
})
export class HidePhonePipe implements PipeTransform {

  constructor(private auth: AuthService) {
  }

  transform(phone: string, userId: string, writerId: string): string {

    if (this.auth.me && (this.auth.isOperator || this.auth.me._id === userId || this.auth.me._id === writerId)) {
      return phone;
    }

    const length = phone.length;
    return String(phone.substr(0, 3)).padEnd(length, '*');
  }
}
