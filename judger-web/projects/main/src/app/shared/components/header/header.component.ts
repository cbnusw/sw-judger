import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { INavMenu } from '../../models/nav-menu';
import { MobileNavigationComponent } from '../mobile-navigation/mobile-navigation.component';


@Component({
  selector: 'sw-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
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
      link: '/contest/list'
    },
    // {
    //   name: '강의',
    //   link: '/'
    // },
    {
      name: '대회관리',
      link: '/contest/list/me',
      condition$: this.auth.isOperator$
    },
    // {
    //   name: '시험/과제관리',
    //   link: '/',
    //   condition$: this.auth.hasJudgePermission$,
    // },
    {
      name: '문제관리',
      link: '/problem/list/me',
      condition$: this.auth.hasJudgePermission$
    }
  ];

  @ViewChild(MobileNavigationComponent) mobileNav: MobileNavigationComponent;

  constructor(public auth: AuthService) {
  }

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

  ngOnInit(): void {
  }
}
