import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'project-lottery';

  // constructor(private permissionsService: NgxPermissionsService) {
  //   // ตั้งค่าสิทธิ์ตามความต้องการของคุณที่นี่

  //   // ตั้งค่าสิทธิ์สำหรับผู้ใช้
  //   const userPermissions = ['user'];

  //   // ตั้งค่าสิทธิ์สำหรับผู้ดูแลระบบ
  //   const adminPermissions = ['admin'];

  //   // ตั้งค่าสิทธิ์สำหรับสมาชิก
  //   const memberPermissions = ['member'];

  //   // โหลดและกำหนดสิทธิ์สำหรับผู้ใช้และผู้ดูแลระบบ
  //   this.permissionsService.loadPermissions(userPermissions);
  //   this.permissionsService.loadPermissions(adminPermissions);
  //   this.permissionsService.loadPermissions(memberPermissions);
  // }
}
