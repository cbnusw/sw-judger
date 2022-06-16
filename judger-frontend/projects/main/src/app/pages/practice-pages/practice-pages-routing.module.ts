import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyPracticeSubmitListComponent } from './my-practice-submit-list/my-practice-submit-list.component';
import { PracticeDetailPageComponent } from './practice-detail-page/practice-detail-page.component';
import { PracticeFormPageComponent } from './practice-form-page/practice-form-page.component';
import { PracticeListPageComponent } from './practice-list-page/practice-list-page.component';
import { PracticeSubmitDetailPageComponent } from './practice-submit-detail-page/practice-submit-detail-page.component';
import { PracticeSubmitListPageComponent } from './practice-submit-list-page/practice-submit-list-page.component';
import { PracticeSubmitPageComponent } from './practice-submit-page/practice-submit-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/practice/list', pathMatch: 'full' },
  { path: 'list', component: PracticeListPageComponent },
  { path: 'register', component: PracticeFormPageComponent },
  { path: 'edit/:id', component: PracticeFormPageComponent },
  { path: 'detail/:id', component: PracticeDetailPageComponent },
  { path: 'submit/:id', component: PracticeSubmitPageComponent },
  { path: 'submit/:id/my-list', component: MyPracticeSubmitListComponent},
  { path: 'submit/:id/list', component: PracticeSubmitListPageComponent},
  { path: 'submit/:id/detail', component: PracticeSubmitDetailPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PracticePagesRoutingModule {
}
