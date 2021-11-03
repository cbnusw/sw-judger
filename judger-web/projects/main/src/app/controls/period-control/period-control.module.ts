import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { PeriodControlComponent } from './period-control/period-control.component';


@NgModule({
  declarations: [PeriodControlComponent],
  exports: [
    PeriodControlComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule
  ]
})
export class PeriodControlModule { }
