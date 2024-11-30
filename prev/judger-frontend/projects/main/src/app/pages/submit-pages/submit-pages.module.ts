import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FileModule } from '../../directives/file/file.module';
import { PeriodPipeModule } from '../../pipes/period-pipe/period-pipe.module';
import { RestTimePipeModule } from '../../pipes/rest-time-pipe/rest-time-pipe.module';
import { SubmitResultPipeModule } from '../../pipes/submit-result-pipe/submit-result-pipe.module';
import { InnerHtmlModule } from '../../directives/inner-html/inner-html.module';
import { SubmitPagesRoutingModule } from './submit-pages-routing.module';
import { SubmitListPageComponent } from './submit-list-page/submit-list-page.component';
import { SubmitPageComponent } from './submit-page/submit-page.component';
import { SubmitDetailPageComponent } from './submit-detail-page/submit-detail-page.component';


@NgModule({
  declarations: [SubmitListPageComponent, SubmitPageComponent, SubmitDetailPageComponent],
  imports: [
    CommonModule,
    SubmitPagesRoutingModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    FileModule,
    PeriodPipeModule,
    RestTimePipeModule,
    SubmitResultPipeModule,
    InnerHtmlModule,
  ]
})
export class SubmitPagesModule { }
