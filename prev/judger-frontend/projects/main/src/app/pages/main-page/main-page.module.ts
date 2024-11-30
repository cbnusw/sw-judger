import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { BackgroundModule } from '../../directives/background/background.module';
import { PeriodPipeModule } from '../../pipes/period-pipe/period-pipe.module';
import { RestTimePipeModule } from '../../pipes/rest-time-pipe/rest-time-pipe.module';
import { SharedModule } from '../../shared/shared.module';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { MainPageComponent } from './main-page.component';
import { ProgressingContestListComponent } from './components/progressing-contest-list/progressing-contest-list.component';
import { MyRegisteredContestComponent } from './components/my-registered-contest/my-registered-contest.component';
import { ContestManualDialogComponent } from './components/contest-manual-dialog/contest-manual-dialog.component';
import { AssignmentManualDialogComponent } from './components/assignment-manual-dialog/assignment-manual-dialog.component';

@NgModule({
  declarations: [
    MainPageComponent,
    LoginFormComponent,
    ProgressingContestListComponent,
    MyRegisteredContestComponent,
    ContestManualDialogComponent,
    AssignmentManualDialogComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    BackgroundModule,
    PeriodPipeModule,
    RestTimePipeModule,
    MatIconModule,
  ],
  exports: [
    MainPageComponent
  ]
})
export class MainPageModule {}
