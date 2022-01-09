import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FileModule } from '../../directives/file/file.module';
import { SecurePipeModule } from '../../pipes/secure-pipe/secure-pipe.module';
import { PdfUploaderControlComponent } from './pdf-uploader-control/pdf-uploader-control.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';



@NgModule({
  declarations: [PdfUploaderControlComponent],
  imports: [
    CommonModule,
    FileModule,
    SecurePipeModule,
    MatProgressSpinnerModule,
    PdfViewerModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [PdfUploaderControlComponent]
})
export class PdfUploaderControlModule { }
