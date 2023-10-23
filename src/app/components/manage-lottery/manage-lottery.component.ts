import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Lottery, Convert as lotteryCvt } from 'src/app/model/Lottery.model';
import { CartService } from 'src/app/services/cart.service';
import { LotteryService } from 'src/app/services/lottery.service';
import { AdminAddComponent } from '../admin-add/admin-add.component';

import { AdminEditComponent } from '../admin-edit/admin-edit.component';
import { LotteryDetailComponent } from '../lottery-detail/lottery-detail.component';
import { MyDialogComponent } from '../my-dialog/my-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-lottery',
  templateUrl: './manage-lottery.component.html',
  styleUrls: ['./manage-lottery.component.css'],
})
export class ManageLotteryComponent {
  lotteryResults = Array<Lottery>();
  isMultiple = false;
  lotteriesByNumber = new Array<any>();
  allLotteryResults = Array<Lottery>();
  selectedLotteries: Lottery[] = [];
  period = ''; // ตัวแปร period เพื่อเก็บค่างวดที่ถูกเลือก
  periodList: number[] = []; // ตัวแปร periodList เพื่อเก็บรายการงวดทั้งหมด
  selectedPeriod: number | null = null; // กำหนดให้มีค่าเริ่มต้นเป็น null
  set_number = '';
  set_numberList: number[] = [];

  constructor(
    public lotteryService: LotteryService,
    private http: HttpClient,
    private dialog: MatDialog,
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    http.get(lotteryService.apiEndpoint + '/lottery').subscribe((data: any) => {
      this.allLotteryResults = lotteryCvt.toLottery(JSON.stringify(data));
      this.lotteryResults = this.allLotteryResults;
      this.isMultiple = this.lotteryService.isMultiple;
      this.lotteriesByNumber = this.lotteryService.lotteriesByNumber;
      // ดึงรายการงวดทั้งหมดและกำหนดให้กับ periodList
      this.periodList = [
        ...new Set(this.allLotteryResults.map((lottery) => lottery.period)),
      ];
      this.set_numberList = [
        ...new Set(this.allLotteryResults.map((lottery) => lottery.set_number)),
      ];
    });
  }
  onPeriodSelect() {
    // เรียกฟังก์ชันที่ค้นหาสลากโดยใช้งวดที่ถูกเลือก
    this.selectByPeriod();
  }

  selectByPeriod() {
    if (typeof this.period === 'string' && this.period.trim() !== '') {
      const selectedPeriod = parseInt(this.period, 10);
      this.lotteryResults = this.allLotteryResults.filter((lottery) => {
        return (
          lottery.period === selectedPeriod &&
          (!this.set_number ||
            lottery.set_number.toString() === this.set_number)
        );
      });
    } else {
      // ถ้าไม่ได้เลือกงวดหรือเลือกงวดว่างเปล่า ให้แสดงทุกสลาก
      this.lotteryResults = this.allLotteryResults.filter((lottery) => {
        return (
          !this.set_number || lottery.set_number.toString() === this.set_number
        );
      });
    }

    // เพิ่มการแจ้งเตือน SweetAlert2 เมื่อไม่พบผลลัพธ์
    if (this.lotteryResults.length === 0) {
      Swal.fire({
        title: 'ไม่พบสลาก',
        text: 'ไม่พบสลากที่ค้นหา',
        icon: 'info',
        confirmButtonText: 'ตกลง',
      });
    }
  }
  onSet_numberSelect() {
    // เรียกฟังก์ชันที่ค้นหาสลากโดยใช้งวดที่ถูกเลือก
    this.selectBySet_number();
  }

  selectBySet_number() {
    if (typeof this.set_number === 'string' && this.set_number.trim() !== '') {
      const selectedSet_number = parseInt(this.set_number, 10);
      this.lotteryResults = this.allLotteryResults.filter((lottery) => {
        return (
          (!this.period || lottery.period === parseInt(this.period, 10)) &&
          lottery.set_number === selectedSet_number
        );
      });
    } else {
      // ถ้าไม่ได้เลือกชุดหรือเลือกชุดว่างเปล่า ให้แสดงทุกสลาก
      this.lotteryResults = this.allLotteryResults.filter((lottery) => {
        return !this.period || lottery.period === parseInt(this.period, 10);
      });
    }

    // เพิ่มการแจ้งเตือน SweetAlert2 เมื่อไม่พบผลลัพธ์
    if (this.lotteryResults.length === 0) {
      Swal.fire({
        title: 'ไม่พบสลาก',
        text: 'ไม่พบสลากที่ค้นหา',
        icon: 'info',
        confirmButtonText: 'ตกลง',
      });
    }
  }

  Edit(lottery: Lottery): void {
    const dialogRef = this.dialog.open(AdminEditComponent, {
      width: '400px',
      data: lottery,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog was closed');
    });
  }

  Add(): void {
    const dialogRef = this.dialog.open(AdminAddComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog was closed');
    });
  }
  Delete(lottery: Lottery): void {
    Swal.fire({
      title: 'ยืนยันการลบ',
      text: 'คุณต้องการลบข้อมูลสลากนี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบ!',
      cancelButtonText: 'ยกเลิก',
      customClass: {
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel',
        title: 'swal2-title',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // ตรวจสอบว่าการลบสำเร็จหรือไม่
        this.http
          .delete<any>(
            this.lotteryService.apiEndpoint + '/lottery/' + lottery.id
          )
          .subscribe(
            (response) => {
              // ตรวจสอบคำตอบที่ได้จาก API
              console.log(response);

              if (response) {
                // สำเร็จ
                Swal.fire({
                  title: 'ลบสำเร็จ',
                  text: 'ข้อมูลสลากถูกลบเรียบร้อยแล้ว',
                  icon: 'success',
                  customClass: {
                    confirmButton: 'swal2-confirm',
                    title: 'swal2-title',
                  },
                }).then(() => {
                  window.location.reload();
                });
              } else {
                // ไม่สามารถลบได้
                Swal.fire({
                  title: 'ลบไม่สำเร็จ',
                  text: 'ไม่สามารถลบข้อมูลสลากได้',
                  icon: 'error',
                  customClass: {
                    confirmButton: 'swal2-confirm',
                    title: 'swal2-title',
                  },
                });
              }
            },
            (error: any) => {
              console.error(
                'เกิดข้อผิดพลาดในการลบข้อมูล: ' + JSON.stringify(error)
              );
              Swal.fire({
                title: 'ลบไม่สำเร็จ',
                text: 'เกิดข้อผิดพลาดในการลบข้อมูล',
                icon: 'error',
                customClass: {
                  confirmButton: 'swal2-confirm',
                  title: 'swal2-title',
                },
              });
            }
          );
      }
    });
  }

  // Delete(lottery: Lottery): void {
  //   Swal.fire({
  //     title: 'ยืนยันการลบ',
  //     text: 'คุณต้องการลบข้อมูลสลากนี้หรือไม่?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'ใช่, ลบ!',
  //     cancelButtonText: 'ยกเลิก',
  //     customClass: {
  //       confirmButton: 'swal2-confirm',
  //       cancelButton: 'swal2-cancel',
  //       title: 'swal2-title',
  //     },
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       // ส่งคำร้องขอลบข้อมูลของสลากไปยังเซิร์ฟเวอร์ หรือใช้วิธีการลบข้อมูลที่คุณใช้
  //       // ตรวจสอบว่าการลบสำเร็จหรือไม่
  //       const deleteSuccess = true; // ตั้งค่าเป็น true หรือ false ตามผลการลบ

  //       if (deleteSuccess) {
  //         Swal.fire({
  //           title: 'ลบสำเร็จ',
  //           text: 'ข้อมูลสลากถูกลบเรียบร้อยแล้ว',
  //           icon: 'success',
  //           customClass: {
  //             confirmButton: 'swal2-confirm',
  //             title: 'swal2-title',
  //           },
  //         });
  //       } else {
  //         Swal.fire({
  //           title: 'ลบไม่สำเร็จ',
  //           text: 'ไม่สามารถลบข้อมูลสลากได้',
  //           icon: 'error',
  //           customClass: {
  //             confirmButton: 'swal2-confirm',
  //             title: 'swal2-title',
  //           },
  //         });
  //       }
  //     }
  //   });
  // }

  // openLotteryDetailDialog(lottery: Lottery): void {
  //   const dialogRef = this.dialog.open(LotteryDetailComponent, {
  //     width: '400px',
  //     data: lottery,
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log('Dialog was closed');
  //   });
  // }
  openLotteryDetailDialog(lottery: Lottery): void {
    Swal.fire({
      title: 'รายละเอียดสลาก',
      html: `
        <p>เลขฉลาก: ${lottery.ticket_number}</p>
        <p>งวดที่: ${lottery.period}</p>
        <p>ชุด: ${lottery.set_number}</p>
        <p>ราคา: ${lottery.price}</p>
        <p>จำนวน: ${lottery.quantity}</p>
      `,
      confirmButtonText: 'ปิด',
      customClass: {
        confirmButton: 'swal2-confirm',
        closeButton: 'swal2-close',
        title: 'swal2-title',
        htmlContainer: 'swal2-content',
      },
    });
  }
  getInputValues(): string {
    let concatenatedValue = '';
    for (let i = 1; i <= 6; i++) {
      const inputElement = document.getElementsByName(
        'input' + (i - 1)
      )[0] as HTMLInputElement;
      if (inputElement) {
        concatenatedValue += inputElement.value;
      }
    }
    return concatenatedValue;
  }

  search(input: string) {
    this.isMultiple = true;
    this.lotteriesByNumber = [];
    const inputArray = input.split(',');

    const ticketNumbers = inputArray.map((inputItem) =>
      Number(inputItem.trim())
    );

    this.lotteryResults = this.allLotteryResults.filter((lottery) => {
      const lotteryNumbers = lottery.ticket_number
        .toString()
        .split(',')
        .map(Number);

      const hasAllNumbers = ticketNumbers.every((number) =>
        lotteryNumbers.includes(number)
      );

      const ticketNumberStrings = ticketNumbers.map((number) =>
        number.toString()
      );

      const startsWithNumber = ticketNumberStrings.some((inputNumber) =>
        lotteryNumbers.some((lotteryNumber) =>
          lotteryNumber.toString().startsWith(inputNumber)
        )
      );

      const endsWithNumber = ticketNumberStrings.some((inputNumber) =>
        lotteryNumbers.some((lotteryNumber) =>
          lotteryNumber.toString().endsWith(inputNumber)
        )
      );

      return hasAllNumbers || startsWithNumber || endsWithNumber;
    });

    // เพิ่มการแจ้งเตือน SweetAlert2 เมื่อไม่พบผลลัพธ์
    if (this.lotteryResults.length === 0) {
      Swal.fire({
        title: 'ไม่พบสลาก',
        text: 'ไม่พบสลากที่ค้นหา',
        icon: 'info',
        confirmButtonText: 'ตกลง',
      });
    }
  }

  resetSearch() {
    // รีเซ็ตค่าใน input ทั้ง 6 ช่อง
    for (let i = 1; i <= 6; i++) {
      const inputElement = document.getElementsByName(
        'input' + (i - 1)
      )[0] as HTMLInputElement;
      if (inputElement) {
        inputElement.value = '';
      }
    }

    // รีเซ็ตค่าใน select ของงวดและชุด
    this.period = '';
    this.set_number = '';

    // รีเซ็ตค้นหาและแสดงสลากทั้งหมดอีกครั้ง
    this.lotteryResults = this.allLotteryResults;
  }

  addToCart(result: any) {
    this.cartService.addToCart(result);
    console.log('เพิ่มสลากลงตะกร้า ', result);

    // สร้างข้อมูลสลากที่ถูกเพิ่มลงในตะกร้า
    const lotteryInfo = ` : ${result.ticket_number} ราคา : ${result.price} บาท ชุดที่ : ${result.set_number} งวดที่ : ${result.period}`;

    // ตั้งค่าคอนฟิกของ snackBar
    const config = new MatSnackBarConfig();
    config.duration = 5000; // ระยะเวลาที่ snackBar แสดง (ms)
    config.panelClass = ['custom-snackbar']; // คลาส CSS สำหรับ snackBar

    // แสดง snackBar ด้วยข้อมูลสลากที่ถูกเพิ่มลงในตะกร้า
    this.snackBar.open(
      `หมายเลขสลาก\n${lotteryInfo}ถูกเพิ่มเข้าไปยังตะกร้า`,
      '',
      config
    );
  }

  getCartBadgeCount(result: any): number {
    // นี่คือตำแหน่งในตะกร้าของคุณที่ต้องการคำนวณจำนวนสลาก
    // ในที่นี้ฉันใช้เลขสุ่มเป็นตัวอย่างเท่านั้น
    return Math.floor(Math.random() * 10); // เปลี่ยนเป็นตำแหน่งจริงในตะกร้าของคุณ
  }

  checkout() {
    // Calculate the total price of selected lotteries
    const totalPrice = this.selectedLotteries.reduce(
      (total, lottery) => total + lottery.price,
      0
    );

    // For demonstration, show an alert with the total price
    Swal.fire({
      title: 'ยืนยันการสั่งซื้อ',
      text: `ยอดรวม: ${totalPrice} บาท`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear the selected lotteries and reset the cart
        this.selectedLotteries = [];
        this.cartService.clearCart();

        Swal.fire({
          title: 'สั่งซื้อสำเร็จ',
          text: 'ขอบคุณที่ใช้บริการ!',
          icon: 'success',
          confirmButtonText: 'ตกลง',
        });
      }
    });
  }

  account_login() {
    Swal.fire({
      title: 'กรุณาสมัครสมาชิกก่อนเข้าใช้งาน',
      icon: 'warning',
      confirmButtonText: 'ตกลง',
    }).then((result) => {
      if (result.isConfirmed) {
        // นำทางไปยังหน้า login หลังจากกดปุ่ม "ตกลง"
        window.location.href = '/login';
      }
    });
  }
}
