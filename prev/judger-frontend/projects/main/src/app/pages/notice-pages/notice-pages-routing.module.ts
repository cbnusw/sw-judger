import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoticeMainPageComponent } from './notice-main-page/notice-main-page.component';

const routes: Routes = [
  {path:'', component: NoticeMainPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class NoticePagesRoutingModule { }
