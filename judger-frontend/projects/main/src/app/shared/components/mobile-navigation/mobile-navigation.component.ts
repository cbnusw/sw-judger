import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { LayoutService } from '../../../services/layout.service';
import { INavMenu } from '../../models/nav-menu';

@Component({
  selector: 'sw-mobile-navigation',
  templateUrl: './mobile-navigation.component.html',
  styleUrls: ['./mobile-navigation.component.scss']
})
export class MobileNavigationComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  prevY: number;

  @Input() menus: INavMenu[] = [];
  @Output() changeOpenNav: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('navBody') navBodyRef: ElementRef;

  @HostListener('wheel', ['$event'])
  handleWheel(e: WheelEvent): void {
    if (this.navBodyRef) {
      this.navBodyRef.nativeElement.scrollTop += e.deltaY;
    }
    e.preventDefault();
  }

  @HostListener('touchstart', ['$event'])
  handleTouched(e: TouchEvent): void {
    this.prevY = e.targetTouches[0].clientY;

  }

  @HostListener('touchmove', ['$event'])
  handleTouchmove(e: TouchEvent): void {
    const y = e.targetTouches[0].clientY;
    const deltaY = this.prevY - y;
    this.prevY = y;
    if (this.navBodyRef) {
      this.navBodyRef.nativeElement.scrollTop += deltaY;
    }
    e.preventDefault();
  }

  constructor(public auth: AuthService,
              private layout: LayoutService,
              private router: Router) {
  }

  open(): void {
    this.changeOpenNav.emit(true);
  }

  close(): void {
    this.changeOpenNav.emit(false);
  }

  logout(): boolean {
    this.auth.logout();
    this.close();
    return false;
  }

  movePage(link: string): boolean {
    this.router.navigateByUrl(link);
    this.close();
    return false;
  }

  ngOnInit(): void {
    this.subscription = this.layout.desktop$.subscribe(
      isDesktop => {
        if (isDesktop) {
          this.changeOpenNav.emit(false);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
