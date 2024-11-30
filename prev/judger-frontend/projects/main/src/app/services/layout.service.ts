import { BreakpointObserver } from '@angular/cdk/layout';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export declare type TLayoutType = 'desktop' | 'mobile';
export const MOBILE_MAX_SIZE = new InjectionToken<number>('MOBILD_MAX_SIZE');

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  private layoutSubject: BehaviorSubject<TLayoutType> = new BehaviorSubject('desktop');
  type$: Observable<TLayoutType> = this.layoutSubject.asObservable();
  desktop$: Observable<boolean> = this.type$.pipe(map(type => type === 'desktop'));
  mobile$: Observable<boolean> = this.type$.pipe(map(type => type === 'mobile'));

  constructor(breakpointObserver: BreakpointObserver,
              @Optional() @Inject(MOBILE_MAX_SIZE) size?: number) {
    if (!size) {
      size = 991.98;
    }

    breakpointObserver.observe(`(max-width: ${size}px)`)
      .subscribe(result => {
        const type: TLayoutType = result.matches ? 'mobile' : 'desktop';
        this.layoutSubject.next(type);
      });
  }

  get type(): TLayoutType {
    return this.layoutSubject.value;
  }
}
