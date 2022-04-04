import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { IUserInfo } from '../../models/user-info';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'sw-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})

export class MainPageComponent implements OnInit {

  me:IUserInfo;

  constructor( public auth: AuthService,
               public layout: LayoutService ) {
  }

  get isStudent(): boolean {
    return this.auth.me?.role === 'student';
  }

  get isAdmin(): boolean {
    return this.auth.isOperator;
  }

  ngOnInit(): void {
  }
}
