import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[swBackgroundColor]'
})
export class BackgroundColorDirective {

  @HostBinding('style.background-color') backgroundColor = 'transparent';

  constructor() {
  }

  @Input() set swBackgroundColor(color: string) {
    this.backgroundColor = color;
  }
}
