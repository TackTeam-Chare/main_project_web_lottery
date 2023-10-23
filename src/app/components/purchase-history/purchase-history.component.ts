import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Lottery } from 'src/app/model/Lottery.model';
import { Purchase } from 'src/app/model/purchase.model';
import { CartService } from 'src/app/services/cart.service';
import { LotteryService } from 'src/app/services/lottery.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.css']
})
export class PurchaseHistoryComponent {
  lotteryResults = Array<Lottery>();
  isMultiple = false;
  lotteriesByNumber = new Array<any>();
  allLotteryResults = Array<Lottery>();
  cartItems: Lottery[] = [];
  dataSource = new MatTableDataSource<Purchase>([]);
  selectedDate: Date | null = null;

  ticketNumberSearch: string = ''; // สร้างตัวแปร ticketNumberSearch และกำหนดค่าเริ่มต้นเป็นสตริงว่าง




  hasSearchResults: boolean = true;
  id = this.cartService.Usersid;
  // allResults: string | undefined;
  Results: any;
  allLResults: any;
  constructor(private cartService: CartService, private router: Router,
    private snackBar: MatSnackBar,
        private http: HttpClient,
public data: LotteryService,
    private dialog: MatDialog) {
    console.log(this.id);
     this.http.get(this.data.apiEndpoint + "/purchase/" + this.id).subscribe(
      (response) => {
        console.log("สถานะการอัปเดตข้อมูล: " + response);
         console.log("ผลการอัปเดตข้อมูล: " + JSON.stringify(response));
         this.allLResults = response;
this.Results = this.allLResults;

         console.log(this.Results);
         
      },
      (error) => {
        console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล: " + JSON.stringify(error));
      }
    );
    
  }

  ngOnInit() {
    this.cartService.getItems().subscribe((items) => {
      this.cartItems = items;
    });
  }
  
  removeFromCart(lottery: Lottery) {
    const config = new MatSnackBarConfig();
    config.duration = 5000; // ระยะเวลาที่ snackBar แสดง (ms)
    config.panelClass = ['custom-snackbar']; // คลาส CSS สำหรับ snackBar
    
    const snackBarRef = this.snackBar.open('คุณแน่ใจหรือไม่ที่ต้องการลบสลากนี้ออกจากตะกร้า?', 'ยืนยัน', config);
  
    snackBarRef.onAction().subscribe(() => {
      this.cartService.clearSpecificLottery(lottery);
      console.log(lottery);
    });
  }
  
  
  
  clearCart() {
    const snackBarRef = this.snackBar.open('คุณต้องการลบทั้งหมดใช่หรือไม่?', 'ยืนยัน', {
      duration: 5000, // ระยะเวลาในการแสดง Snackbar (5 วินาที)
    });

    snackBarRef.onAction().subscribe(() => {
      // ถ้าผู้ใช้คลิกที่ปุ่ม "ยืนยัน"
      // ให้เรียกใช้งานเมธอด clearCart() หรือสิ่งที่คุณต้องการทำเมื่อต้องการลบทั้งหมด
      this.clearCartConfirmed();
    });
  }
  clearCartConfirmed() {
 
    this.cartService.clearCart();
    console.log("ลบทั้งหมด",this.cartService)
  }

  getCartBadgeCount(lottery: Lottery): number {
    const existingLottery = this.cartItems.find(
      (item) => item.ticket_number === lottery.ticket_number
    );
    return existingLottery ? existingLottery.quantity || 0 : 0;
  }
  
  goToSearch() {
    this.router.navigate(['/member']);
  }

  calculateTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      if (item.quantity !== undefined) {
        return total + (item.price * item.quantity);
      } else {
        return total;
      }
    }, 0);
  }
  
  calculateTotalItems(): number {
    return this.cartItems.reduce((total, item) => {
      if (item.quantity !== undefined) {
        return total + item.quantity;
      } else {
        return total;
      }
    }, 0);
  }
  
  

  incrementQuantity(lottery: Lottery) {
    const existingLottery = this.cartItems.find(
      (item) => item.ticket_number === lottery.ticket_number
    );
  
    if (existingLottery && existingLottery.quantity) {
      existingLottery.quantity += 1;
      console.log(`เพิ่มสลาก ${existingLottery.ticket_number} ในตะกร้า: ${existingLottery.quantity}`);
    } else if (existingLottery) {
      existingLottery.quantity = 1;
      console.log(`เพิ่มสลาก ${existingLottery.ticket_number} ในตะกร้า: 1`);
    }
  }
  
 
decrementQuantity(lottery: Lottery) {
  const existingLottery = this.cartItems.find(
    (item) => item.ticket_number === lottery.ticket_number
  );

  if (existingLottery && existingLottery.quantity && existingLottery.quantity > 1) {
    existingLottery.quantity -= 1;
    if (existingLottery) {
      console.log(`ลดจำนวนสลาก ${existingLottery.ticket_number} ในตะกร้า: ${existingLottery.quantity}`);
    }
  } else if (existingLottery) {
    // ถ้ามีแค่ 1 ใบให้ไม่ทำอะไร
  }
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
    // ตรวจสอบว่า lottery ไม่ใช่ null ก่อนที่จะใช้ .toString()
    const itemTicketNumber = lottery ? lottery.ticket_number.toString() : '';
    
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
      confirmButtonText: 'ตกลง'
    });
  }
}
resetSearch() {
  // รีเซ็ตค่าทุกอย่างเป็นค่าเริ่มต้น
  this.selectedDate = null;
  this.dataSource.data = this.allLResults;
  this.hasSearchResults = true;
}
filterData() {
  if (!this.selectedDate) {
    // แสดง SweetAlert2 ถ้าไม่ได้ป้อนข้อมูลและกดค้นหา
    Swal.fire({
      icon: 'info',
      title: 'กรุณาป้อนข้อมูล',
      text: 'โปรดเลือกวันที่ก่อนค้นหา',
    });
    return; // ไม่ดำเนินการต่อไปถ้าไม่ได้ป้อนข้อมูล
  }

  this.dataSource.data = this.allLResults.filter((purchase: Purchase) => {
    const purchaseDate = new Date(purchase.created_at);
    return purchaseDate.toDateString() === this.selectedDate!.toDateString();
  });

  // ตรวจสอบว่ามีผลลัพธ์หรือไม่
  this.hasSearchResults = this.dataSource.data.length > 0;

  // แสดง SweetAlert2 ถ้าไม่มีผลลัพธ์
  if (!this.hasSearchResults) {
    Swal.fire({
      icon: 'info',
      title: 'ไม่พบผลลัพธ์',
      text: 'ไม่พบผลลัพธ์ที่ตรงกับคำค้นหาของคุณ',
    });
  }
}


}
