import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { DateTimeControlComponent } from './date-time-control/date-time-control.component';



@NgModule({
  declarations: [DateTimeControlComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule
  ],
  exports: [DateTimeControlComponent]
})
export class DateTimeControlModule { }
