import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LotteryService } from 'src/app/services/lottery.service';
import Swal from 'sweetalert2'; // เพิ่มการนำเข้า SweetAlert2

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.css'],
})
export class AdminEditComponent {
  constructor(
    private data: LotteryService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AdminEditComponent>,
    @Inject(MAT_DIALOG_DATA) public lottery: any
  ) {}

  // closeDialog(): void {
  //   this.dialogRef.close();
  // }

  edit(
    ticket_number: string,
    price: string,
    period: string,
    quantity: number,
    set_number: number,
    id: number
  ): void {
    let jsonObj = {
      ticket_number: ticket_number,
      price: parseFloat(price), // แปลงเป็นตัวเลข
      period: parseInt(period), // แปลงเป็นตัวเลข
      set_number: set_number,
      quantity: quantity,
    };

    let jsonString = JSON.stringify(jsonObj);
    console.log(jsonObj);

    // ตรวจสอบว่ามีการเปลี่ยนแปลงข้อมูลหรือไม่
    if (
      ticket_number === this.lottery.ticket_number &&
      price === this.lottery.price.toString() &&
      period === this.lottery.period.toString() &&
      set_number === this.lottery.set_number.toString() &&
      quantity === this.lottery.quantity
    ) {
      // ไม่มีการเปลี่ยนแปลงข้อมูล
      Swal.fire({
        title: 'ไม่มีการเปลี่ยนแปลง',
        text: 'คุณไม่ได้เปลี่ยนแปลงข้อมูล',
        icon: 'info',
        confirmButtonText: 'ตกลง',
      });
    } else {
      // มีการเปลี่ยนแปลงข้อมูล
      // ใช้ SweetAlert2 เพื่อยืนยันการแก้ไข
      Swal.fire({
        title: 'ยืนยันการแก้ไข',
        text: 'คุณต้องการที่จะแก้ไขข้อมูลนี้หรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
      }).then((result) => {
        if (result.isConfirmed) {
          // ถ้าผู้ใช้ยืนยันการแก้ไข
          this.http.put<any>(this.data.apiEndpoint + '/lottery/' + id, jsonString).subscribe(
            (response) => {
              console.log('สถานะการอัปเดตข้อมูล: ' + response.status);
              console.log('ผลการอัปเดตข้อมูล: ' + JSON.stringify(response.body));
              
              // แสดง SweetAlert2 เมื่อแก้ไขสำเร็จ
              Swal.fire({
                title: 'แก้ไขสำเร็จ',
                text: 'ข้อมูลถูกแก้ไขเรียบร้อยแล้ว',
                icon: 'success',
                confirmButtonText: 'ตกลง',
              }).then(() => {
            window.location.reload();
          });

              this.dialogRef.close();
            },
            (error) => {
              console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล: ' + JSON.stringify(error));
            }
          );
        }
      });
    }
  }
}
