import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { MyProblemListPageComponent } from './my-problem-list-page/my-problem-list-page.component';
import { ProblemDetailPageComponent } from './problem-detail-page/problem-detail-page.component';
import { ProblemFormPageComponent } from './problem-form-page/problem-form-page.component';
import { ProblemListPageComponent } from './problem-list-page/problem-list-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/problem/list', pathMatch: 'full' },
  { path: 'list', component: ProblemListPageComponent },
  { path: 'list/me',  component: MyProblemListPageComponent },
  { path: 'new',  component: ProblemFormPageComponent },
  { path: 'edit/:id', component: ProblemFormPageComponent },
  { path: 'detail/:id', component: ProblemDetailPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProblemPagesRoutingModule {
}
