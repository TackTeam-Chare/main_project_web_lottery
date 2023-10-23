import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LotteryService } from 'src/app/services/lottery.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-admin-add',
  templateUrl: './admin-add.component.html',
  styleUrls: ['./admin-add.component.css']
})
export class AdminAddComponent {
  constructor(
    private LotteryService: LotteryService,
    private http: HttpClient,
    private dialogRef: MatDialogRef<AdminAddComponent>,
    private snackBar: MatSnackBar, 
    @Inject(MAT_DIALOG_DATA) public lottery: any
) {
    // this.lotteriesByNumber = LotteryService.lotteriesByNumber;
}


addNew(ticket_number: string, price: string, period: string, set_number: number, quantity: number) {
  let jsonObj = {
    ticket_number: ticket_number,
    price: parseFloat(price),
    period: period,
    set_number: set_number,
    quantity: quantity
  }
  let jsonString = JSON.stringify(jsonObj);
  console.log(jsonObj);

  Swal.fire({
    title: 'ยืนยันการเพิ่มข้อมูลสลาก',
    text: 'คุณต้องการที่จะเพิ่มข้อมูลสลากนี้หรือไม่?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก',
  }).then((result) => {
    if (result.isConfirmed) {
      this.http.post(this.LotteryService.apiEndpoint + "/lottery/add", jsonString, { observe: 'response' }).subscribe((response) => {
        console.log(JSON.stringify(response.status));
        console.log(JSON.stringify(response.body));

        if (response.status === 201) {
          Swal.fire({
            title: 'เพิ่มข้อมูลสำเร็จ',
            text: 'ข้อมูลถูกเพิ่มเรียบร้อยแล้ว',
            icon: 'success',
            confirmButtonText: 'ตกลง',
          }).then(() => {
            window.location.reload();
          });
        } else {
          Swal.fire({
            title: 'เพิ่มข้อมูลไม่สำเร็จ',
            text: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูลสลาก',
            icon: 'error',
            confirmButtonText: 'ตกลง',
          });
        }
        this.dialogRef.close();
      }, (error) => {
        console.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล: " + JSON.stringify(error));
        Swal.fire({
          title: 'เพิ่มข้อมูลไม่สำเร็จ',
          text: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูลสลาก',
          icon: 'error',
          confirmButtonText: 'ตกลง',
        });
      });
    }
  });
}
}
