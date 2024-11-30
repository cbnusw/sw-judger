import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { IoSetControlModule } from '../../controls/io-set-control/io-set-control.module';
import { PdfUploaderControlModule } from '../../controls/pdf-uploader-control/pdf-uploader-control.module';
import { FileModule } from '../../directives/file/file.module';
import { SecurePipeModule } from '../../pipes/secure-pipe/secure-pipe.module';
import { SubmitResultPipeModule } from '../../pipes/submit-result-pipe/submit-result-pipe.module';

import { PracticePagesRoutingModule } from './practice-pages-routing.module';
import { PracticeListPageComponent } from './practice-list-page/practice-list-page.component';
import { PracticeDetailPageComponent } from './practice-detail-page/practice-detail-page.component';
import { PracticeFormPageComponent } from './practice-form-page/practice-form-page.component';
import { PracticeSubmitPageComponent } from './practice-submit-page/practice-submit-page.component';
import { PracticeSubmitListPageComponent } from './practice-submit-list-page/practice-submit-list-page.component';
import { MyPracticeSubmitListComponent } from './my-practice-submit-list/my-practice-submit-list.component';
import { PracticeSubmitDetailPageComponent } from './practice-submit-detail-page/practice-submit-detail-page.component';


@NgModule({
  declarations: [
    PracticeListPageComponent,
    PracticeDetailPageComponent,
    PracticeFormPageComponent,
    PracticeSubmitPageComponent,
    PracticeSubmitListPageComponent,
    MyPracticeSubmitListComponent,
    PracticeSubmitDetailPageComponent
  ],
  imports: [
    CommonModule,
    PracticePagesRoutingModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    PdfUploaderControlModule,
    IoSetControlModule,
    PdfViewerModule,
    MatIconModule,
    SecurePipeModule,
    SubmitResultPipeModule,
    FileModule,
    MatSelectModule
  ]
})
export class PracticePagesModule {
}
