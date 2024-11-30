import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BackgroundBlendModeDirective } from './background-blend-mode.directive';
import { BackgroundColorDirective } from './background-color.directive';
import { BackgroundImageDirective } from './background-image.directive';
import { BackgroundPositionDirective } from './background-position.directive';
import { BackgroundRepeatDirective } from './background-repeat.directive';
import { BackgroundSizeDirective } from './background-size.directive';


@NgModule({
  declarations: [
    BackgroundColorDirective,
    BackgroundImageDirective,
    BackgroundPositionDirective,
    BackgroundRepeatDirective,
    BackgroundSizeDirective,
    BackgroundBlendModeDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BackgroundColorDirective,
    BackgroundImageDirective,
    BackgroundPositionDirective,
    BackgroundRepeatDirective,
    BackgroundSizeDirective,
    BackgroundBlendModeDirective,
  ]
})
export class BackgroundModule {
}
