import { Directive, HostBinding, Input } from '@angular/core';

export declare type TBackgroundBlendMode =
  'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'saturation'
  | 'color'
  | 'luminosity';

@Directive({
  selector: '[swBackgroundBlendMode]'
})
export class BackgroundBlendModeDirective {
  @HostBinding('style.background-blend-mode') backgroundBlendMode = 'normal';

  constructor() {
  }

  @Input() set swBackgroundBlendMode(mode: TBackgroundBlendMode) {
    this.backgroundBlendMode = mode;
  }
}
