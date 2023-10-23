import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LotteryService } from 'src/app/services/lottery.service';
import { MemberDataService } from 'src/app/services/member-data.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent {
  memberName: string | null = null;
  constructor(
    private router: Router,
    private lotteryService: LotteryService,
    private memberDataService: MemberDataService,

    ) { }
    ngOnInit() {
   
  
      // ดึงชื่อสมาชิกจาก MemberDataService
      this.memberName = this.memberDataService.getMemberName();
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
        this.lotteryService.isLoggedIn = false;
        this.router.navigate(['/home']); // เด้งไปยังหน้า home
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
}
