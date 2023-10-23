import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-lottery-detail',
  templateUrl: './lottery-detail.component.html',
  styleUrls: ['./lottery-detail.component.css'],
})
export class LotteryDetailComponent {
  constructor(
    public dialogRef: MatDialogRef<LotteryDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public lotteries: any
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
