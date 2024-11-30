import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/not-auth.guard';
import { MainPageComponent } from './pages/main-page/main-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'main', component: MainPageComponent },
  {
    path: 'practice',
    loadChildren: () =>
      import('./pages/practice-pages/practice-pages.module').then(
        (m) => m.PracticePagesModule
      )
  },
  {
    path: 'contest',
    loadChildren: () =>
      import('./pages/contest-pages/contest-pages.module').then(
        (m) => m.ContestPagesModule
      ),
  },
  {
    path: 'problem',
    loadChildren: () =>
      import('./pages/problem-pages/problem-pages.module').then(
        (m) => m.ProblemPagesModule
      ),
  },
  {
    path: 'assignment',
    loadChildren: () =>
      import('./pages/assignment-pages/assignment-pages.module').then(
        (m) => m.AssignmentPagesModule
      ),
  },
  {
    path: 'submit',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/submit-pages/submit-pages.module').then(
        (m) => m.SubmitPagesModule
      ),
  },
  {
    path: 'scoreboard',
    loadChildren: () =>
      import('./pages/score-board-pages/score-board-pages.module').then(
        (m) => m.ScoreBoardPagesModule
      ),
  },
  {
    path: 'notice',
    loadChildren: () =>
      import('./pages/notice-pages/notice-pages.module').then(
        (m) => m.NoticePagesModule
      ),
  },
  {
    path: 'account',
    canActivate: [NotAuthGuard],
    loadChildren: () =>
      import('./pages/account-pages/account-pages.module').then(
        (m) => m.AccountPagesModule
      ),
  },
  {
    path: 'my-page',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/my-pages/my-pages.module').then(
        (m) => m.MyPagesModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
