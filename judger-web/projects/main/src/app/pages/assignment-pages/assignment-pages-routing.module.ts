import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { AssignmentFormPageComponent } from './assignment-form-page/assignment-form-page.component';
import { AssignmentListPageComponent } from './assignment-list-page/assignment-list-page.component';
// import { AssignmentListPageComponent } from '/assignment-list-page/assignment-list-page.component';

const routes: Routes = [
  // { path: 'list', component: AssignmentListPageComponent },
  { path: '', redirectTo: '/assignment/form', pathMatch: 'full' },
  { path: 'list', component: AssignmentListPageComponent },
  { path: 'form', component: AssignmentFormPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignmentPagesRoutingModule {}
