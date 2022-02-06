import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AccountPagesRoutingModule } from './account-pages-routing.module';
import { LoginPageComponent } from './login-page/login-page.component';


@NgModule({
  declarations: [LoginPageComponent],
  imports: [
    CommonModule,
    AccountPagesRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
  ]
})
export class AccountPagesModule { }
