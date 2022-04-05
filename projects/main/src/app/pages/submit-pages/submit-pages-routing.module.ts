import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubmitDetailPageComponent } from './submit-detail-page/submit-detail-page.component';
import { SubmitListPageComponent } from './submit-list-page/submit-list-page.component';
import { SubmitPageComponent } from './submit-page/submit-page.component';

const routes: Routes = [
  { path: '', component: SubmitPageComponent },
  { path: 'list', component: SubmitListPageComponent },
  { path: 'detail/:id', component: SubmitDetailPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubmitPagesRoutingModule {
}
