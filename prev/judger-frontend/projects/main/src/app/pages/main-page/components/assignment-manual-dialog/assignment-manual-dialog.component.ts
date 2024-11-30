import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'sw-assignment-manual-dialog',
  templateUrl: './assignment-manual-dialog.component.html',
  styleUrls: ['./assignment-manual-dialog.component.scss']
})
export class AssignmentManualDialogComponent {

  constructor(private dialogRef: MatDialogRef<AssignmentManualDialogComponent>) {
  }

  closeDialog() {
    this.dialogRef.close();
  }


}
