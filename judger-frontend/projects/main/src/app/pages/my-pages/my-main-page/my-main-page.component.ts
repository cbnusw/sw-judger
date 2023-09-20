import { Component } from '@angular/core';
import { SubmitResultTypePipe } from '../../../pipes/submit-result-pipe/submit-result-type.pipe';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'sw-my-main-page',
  templateUrl: './my-main-page.component.html',
  styleUrls: ['./my-main-page.component.scss'],
  providers: [SubmitResultTypePipe]
})
export class MyMainPageComponent {

  constructor(
    public authService: AuthService,
  ) {
  }

  menus = [
    '프로필 정보',
    '코드 제출 내역',
  ];
  menuIndex = 0;

  protected readonly alert = alert;

  changeMenuIndex(num) {
    this.menuIndex = num;
  }

  logout(): boolean {
    this.authService.logout();
    return false;
  }
}