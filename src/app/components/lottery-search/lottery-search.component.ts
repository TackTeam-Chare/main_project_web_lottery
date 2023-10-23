import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Lottery, Convert as lotteryCvt } from 'src/app/model/Lottery.model';
import { LotteryService } from 'src/app/services/lottery.service';
import { LotteryDetailComponent } from '../lottery-detail/lottery-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { CartService } from 'src/app/services/cart.service'; 
import { Router } from '@angular/router';
import { MyDialogComponent } from '../my-dialog/my-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lottery-search',
  templateUrl: './lottery-search.component.html',
  styleUrls: ['./lottery-search.component.css'],
 
})
export class LotterySearchComponent {
  lotteryResults = Array<Lottery>();
  isMultiple = false;
  lotteriesByNumber = new Array<any>();
  allLotteryResults = Array<Lottery>();
  selectedLotteries: Lottery[] = [];
  period = ''; // ตัวแปร period เพื่อเก็บค่างวดที่ถูกเลือก
  periodList: number[] = []; // ตัวแปร periodList เพื่อเก็บรายการงวดทั้งหมด
  selectedPeriod: number | null = null; // กำหนดให้มีค่าเริ่มต้นเป็น null
  set_number = '';
  set_numberList:number[]=[];
  hasSearchResults: boolean = false; // เริ่มต้นเป็น false
  constructor(
   public lotteryService: LotteryService,
    private http: HttpClient,
    private dialog: MatDialog,
    private cartService: CartService,
    private router : Router,
    private snackBar:MatSnackBar,
    private messageService: MessageService 
  ) {
  
    http.get(lotteryService.apiEndpoint + '/lottery').subscribe((data: any) => {
      this.allLotteryResults = lotteryCvt.toLottery(JSON.stringify(data));
      this.lotteryResults = this.allLotteryResults;
      this.isMultiple = this.lotteryService.isMultiple;
      this.lotteriesByNumber = this.lotteryService.lotteriesByNumber;
       // ดึงรายการงวดทั้งหมดและกำหนดให้กับ periodList
       this.periodList = [...new Set(this.allLotteryResults.map((lottery) => lottery.period))];
       this.set_numberList = [...new Set(this.allLotteryResults.map((lottery) => lottery.set_number))];
    });
  }
  onPeriodSelect() {
    // เรียกฟังก์ชันที่ค้นหาสลากโดยใช้งวดที่ถูกเลือก
    this.selectByPeriod();
  }
  
  selectByPeriod() {
    if (typeof this.period === 'string' && this.period.trim() !== '') {
      const selectedPeriod = parseInt(this.period, 10);
      this.lotteryResults = this.allLotteryResults.filter(
        (lottery) => {
          return (
            lottery.period === selectedPeriod &&
            (!this.set_number || lottery.set_number.toString() === this.set_number)
          );
        }
      );
    } else {
      // ถ้าไม่ได้เลือกงวดหรือเลือกงวดว่างเปล่า ให้แสดงทุกสลาก
      this.lotteryResults = this.allLotteryResults.filter((lottery) => {
        return !this.set_number || lottery.set_number.toString() === this.set_number;
      });
    }
  
    // เพิ่มการแจ้งเตือน SweetAlert2 เมื่อไม่พบผลลัพธ์
    if (this.lotteryResults.length === 0) {
      Swal.fire({
        title: 'ไม่พบสลาก',
        text: 'ไม่พบสลากที่ค้นหา',
        icon: 'info',
        confirmButtonText: 'ตกลง'
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
      this.lotteryResults = this.allLotteryResults.filter(
        (lottery) => {
          return (
            (!this.period || lottery.period === parseInt(this.period, 10)) &&
            lottery.set_number === selectedSet_number
          );
        }
      );
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
        confirmButtonText: 'ตกลง'
      });
    }
  }
  
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
   // ตั้งค่า hasSearchResults ตามผลการค้นหา
   this.hasSearchResults = this.lotteryResults.length > 0;
    // เพิ่มการแจ้งเตือน SweetAlert2 เมื่อไม่พบผลลัพธ์
    if (this.lotteryResults.length === 0) {
      Swal.fire({
        title: 'ไม่พบสลาก',
        text: 'ไม่พบสลากที่ค้นหา',
        icon: 'info',
        confirmButtonText: 'ตกลง'
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
  
  
  
  
  
  addToCart(lottery: Lottery) {
    // เรียกใช้งาน SweetAlert เพื่อยืนยันการเพิ่มสลากลงในตะกร้า
    Swal.fire({
      title: 'ยืนยันการเพิ่มสลาก',
      text: `คุณต้องการเพิ่มสลากรายการนี้ลงในตะกร้าหรือไม่?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ไม่',
    }).then((result) => {
      if (result.value) {
        // ถ้าผู้ใช้กด "ใช่" ให้เพิ่มสลากลงในตะกร้า
        this.cartService.addToCart(lottery);
  
        // แสดง SweetAlert2 แจ้งเตือนสำเร็จ
        Swal.fire({
          icon: 'success',
          title: 'สลากถูกเพิ่มลงในตะกร้า',
          timer: 5000,
          showConfirmButton: false,
        });
      }
    });
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
    alert(`Total Price: ${totalPrice} THB`);

    // Clear the selected lotteries and reset the cart
    this.selectedLotteries = [];
    this.cartService.clearCart();
  }
  account_login() {
    const dialogRef = this.dialog.open(MyDialogComponent, {
      width: '250px',
      data: 'กรุณาสมัครสมาชิกก่อนเข้าใช้งาน'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      // นำไปยังหน้า login
      this.router.navigate(['/login']);
    });
  }
}