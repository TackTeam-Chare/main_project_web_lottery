import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  
  constructor() {}

  refreshPage() {
    window.location.reload();
  }

  dashboard() {
    Swal.fire({
      title: 'กรุณาสมัครสมาชิกก่อนเข้าใช้งาน',
      icon: 'warning',
      confirmButtonText: 'ตกลง'
    }).then((result) => {
      if (result.isConfirmed) {
        // นำทางไปยังหน้า login หลังจากกดปุ่ม "ตกลง"
        window.location.href = '/login';
      }
    });
  }

  account_login() {
    Swal.fire({
      title: 'กรุณาสมัครสมาชิกก่อนเข้าใช้งาน',
      icon: 'warning',
      confirmButtonText: 'ตกลง'
    }).then((result) => {
      if (result.isConfirmed) {
        // นำทางไปยังหน้า login หลังจากกดปุ่ม "ตกลง"
        window.location.href = '/login';
      }
    });
  }
}
