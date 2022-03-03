import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurePipe } from './secure.pipe';

@NgModule({
  declarations: [SecurePipe],
  exports: [SecurePipe],
  imports: [
    CommonModule
  ]
})
export class SecurePipeModule {
}
