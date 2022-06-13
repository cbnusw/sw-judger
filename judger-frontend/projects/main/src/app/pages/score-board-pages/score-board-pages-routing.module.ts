import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { ScoreBoardPageComponent } from './score-board-page/score-board-page.component';

const routes: Routes = [
  { path: '', component: ScoreBoardPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScoreBoardPagesRoutingModule {
}
