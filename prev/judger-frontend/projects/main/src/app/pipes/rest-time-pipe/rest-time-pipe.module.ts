import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestTimePipe } from './rest-time.pipe';



@NgModule({
  declarations: [RestTimePipe],
  imports: [
    CommonModule
  ],
  exports: [RestTimePipe]
})
export class RestTimePipeModule { }
