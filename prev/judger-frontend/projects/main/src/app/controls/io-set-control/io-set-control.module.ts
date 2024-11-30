import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FileModule } from '../../directives/file/file.module';
import { IoSetControlComponent } from './io-set-control/io-set-control.component';



@NgModule({
  declarations: [IoSetControlComponent],
  imports: [
    CommonModule,
    FileModule,
    MatProgressSpinnerModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [IoSetControlComponent]
})
export class IoSetControlModule { }
