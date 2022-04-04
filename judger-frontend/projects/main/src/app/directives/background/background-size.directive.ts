import { Directive, HostBinding, Input } from '@angular/core';

export declare type TBackgroundSize = 'auto' | 'cover' | 'contain' | 'initial' | 'inherit' | string;

@Directive({
  selector: '[swBackgroundSize]'
})
export class BackgroundSizeDirective {

  @HostBinding('style.background-size') backgroundSize: TBackgroundSize;

  constructor() {
  }

  @Input() set swBackgroundSize(size: TBackgroundSize) {
    this.backgroundSize = size;
  }
}
