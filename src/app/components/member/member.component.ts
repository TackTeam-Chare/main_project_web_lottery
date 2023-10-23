import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MemberDataService } from 'src/app/services/member-data.service';
import { LotteryService } from '../../services/lottery.service';
import Swal from 'sweetalert2';

import { CartService } from 'src/app/services/cart.service'; 

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent {
  cartItems: any[] = [];
  constructor(private lotteryService: LotteryService,
     private router: Router,
     private memberDataService: MemberDataService,
     private cartService: CartService,
     private dialog: MatDialog
     ) { }
  memberName: string | null = null;
  ngOnInit() {
    // ดึงรายการสินค้าจาก CartService
    this.cartService.getItems().subscribe((items) => {
      this.cartItems = items;
    });

    // ดึงชื่อสมาชิกจาก MemberDataService
    this.memberName = this.memberDataService.getMemberName();
  }
  isUserLoggedIn(): boolean {
    return this.lotteryService.isLoggedIn;
  }

  logout() {
    Swal.fire({
      title: 'คุณต้องการออกจากระบบหรือไม่?',
      text: 'การออกจากระบบจะทำให้คุณไม่สามารถเข้าถึงระบบได้อีก',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ออกจากระบบ',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        // ทำการออกจากระบบที่นี่
        this.memberDataService.clearMemberName();
        this.lotteryService.isLoggedIn = false;
        this.router.navigate(['/home']); // เด้งไปยังหน้า home
  
        // แสดง SweetAlert2 แจ้งเตือนออกจากระบบสำเร็จ
        Swal.fire({
          icon: 'success',
          title: 'ออกจากระบบสำเร็จ',
          text: 'คุณได้ออกจากระบบเรียบร้อยแล้ว',
          showConfirmButton: false,
          timer: 2000 // แสดงเป็นเวลา 2 วินาที
        });
      } else {
        // แสดง SweetAlert2 แจ้งเตือนยกเลิกการออกจากระบบ
        Swal.fire({
          icon: 'info',
          title: 'ยกเลิกการออกจากระบบ',
          text: 'คุณยังคงเข้าใช้ระบบอยู่',
          showConfirmButton: false,
          timer: 2000 // แสดงเป็นเวลา 2 วินาที
        });
      }
    });
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

}
