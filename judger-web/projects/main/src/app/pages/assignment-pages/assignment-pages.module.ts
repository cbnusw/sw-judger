import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AssignmentDetailPageComponent } from './assignment-detail-page/assignment-detail-page.component';
import { AssignmentFormPageComponent } from './assignment-form-page/assignment-form-page.component';
import { IoSetControlModule } from '../../controls/io-set-control/io-set-control.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PdfUploaderControlModule } from '../../controls/pdf-uploader-control/pdf-uploader-control.module';
import { PeriodControlModule } from '../../controls/period-control/period-control.module';
import { ProblemPagesRoutingModule } from '../problem-pages/problem-pages-routing.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SecurePipeModule } from '../../pipes/secure-pipe/secure-pipe.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [AssignmentDetailPageComponent, AssignmentFormPageComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    IoSetControlModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    PdfUploaderControlModule,
    PeriodControlModule,
    ProblemPagesRoutingModule,
    PdfViewerModule,
    SecurePipeModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
  ],
})
export class AssignmentPagesModule {}
