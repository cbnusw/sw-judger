import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyMainPageComponent } from './my-main-page/my-main-page.component';

const routes: Routes = [
  { path: '', component: MyMainPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MyPagesRoutingModule {
}
