import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PeriodPipeModule } from '../../pipes/period-pipe/period-pipe.module';
import { RestTimePipeModule } from '../../pipes/rest-time-pipe/rest-time-pipe.module';

import { ScoreBoardPagesRoutingModule } from './score-board-pages-routing.module';
import { ScoreBoardPageComponent } from './score-board-page/score-board-page.component';


@NgModule({
  declarations: [ScoreBoardPageComponent],
  imports: [
    CommonModule,
    ScoreBoardPagesRoutingModule,
    PeriodPipeModule,
    RestTimePipeModule,
    MatButtonModule
  ]
})
export class ScoreBoardPagesModule { }
