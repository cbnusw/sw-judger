import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { AssignmentPagesModule } from '../assignment-pages/assignment-pages.module';
import { ProfileInfoComponent } from './components/profile-info/profile-info.component';
import { SubmitResultListComponent } from './components/submit-result-list/submit-result-list.component';
import { MyMainPageComponent } from './my-main-page/my-main-page.component';
import { MyPagesRoutingModule } from './my-pages-routing.module';


@NgModule({
  declarations: [
    MyMainPageComponent,
    SubmitResultListComponent,
    ProfileInfoComponent,
  ],
  imports: [
    CommonModule,
    MyPagesRoutingModule,
    AssignmentPagesModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    ReactiveFormsModule,
  ]
})
export class MyPagesModule {
}
