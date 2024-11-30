import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { IUserInfo } from '../../models/user-info';
import { LayoutService } from '../../services/layout.service';
import {
  AssignmentManualDialogComponent
} from './components/assignment-manual-dialog/assignment-manual-dialog.component';
import { ContestManualDialogComponent } from './components/contest-manual-dialog/contest-manual-dialog.component';

@Component({
  selector: 'sw-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})

export class MainPageComponent implements OnInit {

  me:IUserInfo;

  constructor( public auth: AuthService,
               public layout: LayoutService,
               private dialog: MatDialog ) {
  }
  openContestDialog() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '1024px';
    dialogConfig.maxHeight = '90vh';
    this.dialog.open(ContestManualDialogComponent, dialogConfig);

  }

  openAssignmentDialog() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '1024px';
    dialogConfig.maxHeight = '90vh';
    this.dialog.open(AssignmentManualDialogComponent, dialogConfig);

  }

  get isStudent(): boolean {
    return this.auth.me?.role === 'student';
  }
  
  get isAdmin(): boolean {
    return this.auth.isOperator;
  }

  ngOnInit(): void {
  }
}
