import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoticePagesRoutingModule } from './notice-pages-routing.module';
import { NoticeMainPageComponent } from './notice-main-page/notice-main-page.component';


@NgModule({
  declarations: [NoticeMainPageComponent],
  imports: [
    CommonModule,
    NoticePagesRoutingModule
  ]
})
export class NoticePagesModule { }
