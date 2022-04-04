import { Directive, HostBinding, Input } from '@angular/core';

export declare type TBackgroundRepeat =
  'repeat'
  | 'repeat-x'
  | 'repeat-y'
  | 'no-repeat'
  | 'space'
  | 'round'
  | 'initial'
  | 'inherit';

@Directive({
  selector: '[swBackgroundRepeat]'
})
export class BackgroundRepeatDirective {

  @HostBinding('style.background-repeat') backgroundRepeat: TBackgroundRepeat;

  constructor() {
  }

  @Input() set swBackgroundRepeat(repeat: TBackgroundRepeat) {
    this.backgroundRepeat = repeat;
  }
}
