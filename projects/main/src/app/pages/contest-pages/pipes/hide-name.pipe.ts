import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Pipe({
  name: 'hideName'
})
export class HideNamePipe implements PipeTransform {

  constructor(private auth: AuthService) {
  }

  transform(name: string, userId: string, writerId: string): string {
    if (this.auth.me && (this.auth.isOperator || this.auth.me._id === userId || this.auth.me._id === writerId)) {
      return name;
    }

    const length = name.length;

    return String(name.substr(0, 1)).padEnd(length, '*');
  }

}
