import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
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
import { AssignmentPagesRoutingModule } from './assignment-pages-routing.module';
import { AssignmentListPageComponent } from './assignment-list-page/assignment-list-page.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { PeriodPipeModule } from '../../pipes/period-pipe/period-pipe.module';
import { InnerHtmlModule } from '../../directives/inner-html/inner-html.module';
import { RestTimePipeModule } from '../../pipes/rest-time-pipe/rest-time-pipe.module';
import { AssignmentProblemListPageComponent } from './assignment-problem-list-page/assignment-problem-list-page.component';
import { MyAssignmentListPageComponent } from './my-assignment-list-page/my-assignment-list-page.component';
import { AssignmentSubmitListPageComponent } from './assignment-submit-list-page/assignment-submit-list-page.component';
import { ResultPipe } from './pipe/result.pipe';

@NgModule({
  declarations: [
    AssignmentDetailPageComponent,
    AssignmentFormPageComponent,
    AssignmentListPageComponent,
    AssignmentProblemListPageComponent,
    MyAssignmentListPageComponent,
    AssignmentSubmitListPageComponent,
    ResultPipe
  ],
  imports: [
    CommonModule,
    AssignmentPagesRoutingModule,
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
    PeriodPipeModule,
    ProblemPagesRoutingModule,
    PdfViewerModule,
    SecurePipeModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    CKEditorModule,
    InnerHtmlModule,
    RestTimePipeModule,
    DragDropModule,
    MatDialogModule
  ],
})
export class AssignmentPagesModule {}
