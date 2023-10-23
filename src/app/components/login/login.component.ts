import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Users } from 'src/app/model/Users.model';
import { CartService } from 'src/app/services/cart.service';
import { LotteryService } from '../../services/lottery.service';

import { SweetalertService } from 'src/app/services/sweetalert.service'; 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
}) 
export class LoginComponent  {
  email: string = ''; // เพิ่ม email และกำหนดค่าเริ่มต้นเป็นสตริงว่าง
  password: string = ''; // เพิ่ม password และกำหนดค่าเริ่มต้นเป็นสตริงว่าง
  user = Array<Users>();
  //user: Users[] = [];
  constructor(
    private cartService: CartService,
    private lotteryService: LotteryService,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private sweetAlertService: SweetalertService,
  
  ) {}
    
 

  login(email: string, password: string) {
    if (!email || !password) {
      // ถ้า email หรือ password ไม่ถูกป้อนให้แสดง SweetAlert2 แจ้งเตือน
      this.sweetAlertService.showErrorAlert('เกิดข้อผิดพลาด', 'โปรดกรอกทั้งอีเมลและรหัสผ่าน');
      return;
    }

    const data = {
      email: email,
      password: password,
    };

    let jsonString = JSON.stringify(data);

    this.http.post(this.lotteryService.apiEndpoint + '/login', jsonString).subscribe(
      (response: any) => {
        console.log('เข้าสู่ระบบสำเร็จ:', response);
        this.user = response.user;

        if (response.user.role === 'admin') {
          this.router.navigate(['/dashboard']);
          this.lotteryService.isLoggedIn = true;
          this.lotteryService.setMemberName(response.user.first_name);
          this.cartService.Usersid = response.user.id;
          this.sweetAlertService.showSuccessAlert('Login Success ', '');
          
        } else {
          this.lotteryService.isLoggedIn = true;
          this.lotteryService.setMemberName(response.user.first_name);
          this.cartService.Usersid = response.user.id;
          this.router.navigate(['/member']);
          this.sweetAlertService.showSuccessAlert('Login Success ', '');
        }
      },
      (error) => {
        console.error('เข้าสู่ระบบไม่สำเร็จ:', error);
        this.sweetAlertService.showErrorAlert('เกิดข้อผิดพลาด', 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
    );
  }
}

   
