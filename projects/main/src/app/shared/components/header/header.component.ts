import { Component, OnInit, ViewChild } from '@angular/core';
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
      name: '공개문제',
      link: '/problem/list',
    },
    {
      name: '대회',
      link: '/contest/list',
    },
    {
      name: '교과목',
      link: '/assignment/list',
    },
    {
      name: '대회관리',
      link: '/contest/list/me',
      condition$: this.auth.isOperator$,
    },
    {
      name: '교과목관리',
      link: '/assignment/list/me',
      condition$: this.auth.isOperator$,
    },
  ];

  @ViewChild(MobileNavigationComponent) mobileNav: MobileNavigationComponent;

  constructor(public auth: AuthService) {}

  logout(): boolean {
    this.auth.logout();
    return false;
  }

  openMobileNav(): void {
    this.isOpenMobileNav = true;
  }

  changeOpenNav(isOpen: boolean): void {
    this.isOpenMobileNav = isOpen;
  }

  ngOnInit(): void {}
}
