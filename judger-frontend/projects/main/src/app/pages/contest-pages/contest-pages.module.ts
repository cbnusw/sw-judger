import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { PeriodControlModule } from '../../controls/period-control/period-control.module';
import { InnerHtmlModule } from '../../directives/inner-html/inner-html.module';
import { PeriodPipeModule } from '../../pipes/period-pipe/period-pipe.module';
import { RestTimePipeModule } from '../../pipes/rest-time-pipe/rest-time-pipe.module';
import { AssignmentPagesModule } from '../assignment-pages/assignment-pages.module';
import { ContestantsListComponent } from './components/contestants-list/contestants-list.component';
import { ContestDetailPageComponent } from './contest-detail-page/contest-detail-page.component';
import { ContestFormPageComponent } from './contest-form-page/contest-form-page.component';
import { ContestListPageComponent } from './contest-list-page/contest-list-page.component';
import { ContestPagesRoutingModule } from './contest-pages-routing.module';
import { ContestProblemListPageComponent } from './contest-problem-list-page/contest-problem-list-page.component';
import { MyContestListPageComponent } from './my-contest-list-page/my-contest-list-page.component';
import { HideEmailPipe } from './pipes/hide-email.pipe';
import { HideNamePipe } from './pipes/hide-name.pipe';
import { HideNoPipe } from './pipes/hide-no.pipe';
import { HidePhonePipe } from './pipes/hide-phone.pipe';
import { ContestSubmitListPageComponent } from './contest-submit-list-page/contest-submit-list-page.component';


@NgModule({
  declarations: [
    ContestFormPageComponent,
    ContestListPageComponent,
    MyContestListPageComponent,
    ContestDetailPageComponent,
    ContestProblemListPageComponent,
    ContestantsListComponent,
    HideEmailPipe,
    HidePhonePipe,
    HideNoPipe,
    HideNamePipe,
    ContestSubmitListPageComponent
  ],
  imports: [
    CKEditorModule,
    CommonModule,
    ContestPagesRoutingModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTableModule,
    PeriodControlModule,
    ReactiveFormsModule,
    MatSortModule,
    MatPaginatorModule,
    PeriodPipeModule,
    InnerHtmlModule,
    RestTimePipeModule,
    DragDropModule,
    AssignmentPagesModule,
  ]
})

export class ContestPagesModule {
}
