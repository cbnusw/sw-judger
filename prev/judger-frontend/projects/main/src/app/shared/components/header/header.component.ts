import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { INavMenu } from '../../models/nav-menu';
import { MobileNavigationComponent } from '../mobile-navigation/mobile-navigation.component';

@Component({
  selector: 'sw-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isOpenMobileNav = false;
  menus: INavMenu[] = [
    {
      name: '대회',
      link: '/contest/list',
    },
    {
      name: '교과목',
      link: '/assignment/list',
    },
    {
      name: '대회 관리',
      link: '/contest/list/me',
      condition$: this.auth.isOperator$,
    },
    {
      name: '교과목 관리',
      link: '/assignment/list/me',
      condition$: this.auth.isOperator$,
    },
    {
      name: '공지사항',
      link: '/notice',
    },
    {
      name: '연습문제',
      link: '/practice/list',
    },
  ];

  @ViewChild(MobileNavigationComponent) mobileNav: MobileNavigationComponent;

  constructor(public auth: AuthService, public router: Router) {}

  logout(): boolean {
    this.auth.logout();
    return false;
  }

  get isStudent(): boolean {
    return this.auth.me?.role === 'student';
  }

  openMobileNav(): void {
    this.isOpenMobileNav = true;
  }

  changeOpenNav(isOpen: boolean): void {
    this.isOpenMobileNav = isOpen;
  }

  ngOnInit(): void {}
}
