import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ApplyingPeriodPipe } from './applying-period.pipe';
import { TestPeriodPipe } from './test-period.pipe';
import { PeriodRangePipe } from './period-range.pipe';



@NgModule({
  declarations: [ApplyingPeriodPipe, TestPeriodPipe, PeriodRangePipe],
  imports: [
    CommonModule
  ],
  exports: [ApplyingPeriodPipe, TestPeriodPipe, PeriodRangePipe],
  providers: [DatePipe]
})
export class PeriodPipeModule { }
