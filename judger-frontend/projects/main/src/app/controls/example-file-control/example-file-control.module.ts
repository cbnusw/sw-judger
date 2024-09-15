import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExampleFileControlComponent } from './example-file-control/example-file-control.component';
import { FileModule } from '../../directives/file/file.module';

@NgModule({
  declarations: [ExampleFileControlComponent],
  imports: [
    CommonModule,
    FileModule,
    MatProgressSpinnerModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [ExampleFileControlComponent]
})
export class ExampleFileControlModule { }
