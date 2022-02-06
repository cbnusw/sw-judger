import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Pipe({
  name: 'hideEmail'
})
export class HideEmailPipe implements PipeTransform {

  constructor(private auth: AuthService) {
  }

  transform(email: string, userId: string, writerId: string): string {
    if (this.auth.me && ( this.auth.isOperator || this.auth.me._id === userId || this.auth.me._id === writerId)) {
      return email;
    }
    const chunks = email.split('@');
    const length = chunks[0].length;
    chunks[0] = String(chunks[0].substr(0, Math.floor(length / 2))).padEnd(length, '*');
    return chunks.join('@');
  }
}
