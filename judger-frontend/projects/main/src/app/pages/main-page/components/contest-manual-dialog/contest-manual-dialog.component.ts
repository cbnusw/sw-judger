import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'sw-contest-manual-dialog',
  templateUrl: './contest-manual-dialog.component.html',
  styleUrls: ['./contest-manual-dialog.component.scss']
})
export class ContestManualDialogComponent {

  constructor(private dialogRef: MatDialogRef<ContestManualDialogComponent>) {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
