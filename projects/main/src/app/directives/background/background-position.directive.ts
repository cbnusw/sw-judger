import { Directive, HostBinding, Input } from '@angular/core';

export declare type TBackgroundPosition =
  'left top'
  | 'left center'
  | 'left bottom'
  | 'right top'
  | 'right center'
  | 'right bottom'
  | 'center top'
  | 'center center'
  | 'center bottom'
  | 'center'
  | 'initial'
  | 'inherit'
  | string;

@Directive({
  selector: '[swBackgroundPosition]'
})
export class BackgroundPositionDirective {

  @HostBinding('style.background-position') backgroundPosition: TBackgroundPosition = 'center center';

  constructor() {
  }

  @Input() set swBackgroundPosition(position: TBackgroundPosition) {
    this.backgroundPosition = position;
  }
}
