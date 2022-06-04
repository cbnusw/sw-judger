import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { AssignmentDetailPageComponent } from './assignment-detail-page/assignment-detail-page.component';
import { AssignmentFormPageComponent } from './assignment-form-page/assignment-form-page.component';
import { AssignmentListPageComponent } from './assignment-list-page/assignment-list-page.component';
import { AssignmentProblemListPageComponent } from './assignment-problem-list-page/assignment-problem-list-page.component';
import { AssignmentSubmitListPageComponent } from './assignment-submit-list-page/assignment-submit-list-page.component';
import { MyAssignmentListPageComponent } from './my-assignment-list-page/my-assignment-list-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/assignment/list', pathMatch: 'full' },
  { path: 'list',
      component: AssignmentListPageComponent },
  { path: 'register', component: AssignmentFormPageComponent },
  { path: 'edit/:id', component: AssignmentFormPageComponent },
  { path: 'detail/:id',
      canActivate: [AuthGuard],
      component: AssignmentDetailPageComponent },
  { path: ':id/problems',
      canActivate: [AuthGuard],
      component: AssignmentProblemListPageComponent },
  { path: 'list/me', component: MyAssignmentListPageComponent },
  { path: ':id/submits',
    canActivate: [AuthGuard],
    component: AssignmentSubmitListPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignmentPagesRoutingModule {}
