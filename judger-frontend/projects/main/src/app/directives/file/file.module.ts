import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileChooserDirective } from './file-chooser.directive';



@NgModule({
  declarations: [FileChooserDirective],
  imports: [
    CommonModule
  ],
  exports: [FileChooserDirective]
})
export class FileModule { }
