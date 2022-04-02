import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignmentDetailPageComponent } from './assignment-detail-page/assignment-detail-page.component';
import { AssignmentFormPageComponent } from './assignment-form-page/assignment-form-page.component';
import { AssignmentListPageComponent } from './assignment-list-page/assignment-list-page.component';
import { AssignmentProblemListPageComponent } from './assignment-problem-list-page/assignment-problem-list-page.component';
import { MyAssignmentListPageComponent } from './my-assignment-list-page/my-assignment-list-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/assignment/list', pathMatch: 'full' },
  { path: 'list', component: AssignmentListPageComponent },
  { path: 'register', component: AssignmentFormPageComponent },
  { path: 'edit/:id', component: AssignmentFormPageComponent },
  { path: 'detail/:id', component: AssignmentDetailPageComponent },
  { path: ':id/problems', component: AssignmentProblemListPageComponent },
  { path: 'list/me', component: MyAssignmentListPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignmentPagesRoutingModule {}
