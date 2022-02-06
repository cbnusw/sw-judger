import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { IoSetControlModule } from '../../controls/io-set-control/io-set-control.module';
import { PdfUploaderControlModule } from '../../controls/pdf-uploader-control/pdf-uploader-control.module';
import { PeriodPipeModule } from '../../pipes/period-pipe/period-pipe.module';
import { SecurePipeModule } from '../../pipes/secure-pipe/secure-pipe.module';
import { MyProblemListPageComponent } from './my-problem-list-page/my-problem-list-page.component';
import { ProblemDetailPageComponent } from './problem-detail-page/problem-detail-page.component';
import { ProblemFormPageComponent } from './problem-form-page/problem-form-page.component';
import { ProblemListPageComponent } from './problem-list-page/problem-list-page.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProblemPagesRoutingModule } from './problem-pages-routing.module';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [
    ProblemListPageComponent,
    MyProblemListPageComponent,
    ProblemFormPageComponent,
    ProblemDetailPageComponent,
  ],
  imports: [
    CommonModule,
    IoSetControlModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    PdfUploaderControlModule,
    PeriodPipeModule,
    ProblemPagesRoutingModule,
    PdfViewerModule,
    SecurePipeModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule
  ]
})
export class ProblemPagesModule {
}
