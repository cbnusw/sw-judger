import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
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

@NgModule({
  declarations: [
    MainPageComponent,
    LoginFormComponent,
    ProgressingContestListComponent,
    MyRegisteredContestComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    BackgroundModule,
    PeriodPipeModule,
    RestTimePipeModule,
  ],
  exports: [
    MainPageComponent
  ]
})
export class MainPageModule {}
