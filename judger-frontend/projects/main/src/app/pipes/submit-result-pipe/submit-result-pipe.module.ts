import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitResultTypePipe } from './submit-result-type.pipe';



@NgModule({
  declarations: [SubmitResultTypePipe],
  exports: [
    SubmitResultTypePipe
  ],
  imports: [
    CommonModule
  ]
})
export class SubmitResultPipeModule { }
