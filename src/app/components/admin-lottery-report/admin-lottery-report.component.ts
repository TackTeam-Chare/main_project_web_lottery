import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Purchase } from 'src/app/model/purchase.model';
import { CartService } from 'src/app/services/cart.service';
import { LotteryService } from 'src/app/services/lottery.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-admin-lottery-report',
  templateUrl: './admin-lottery-report.component.html',
  styleUrls: ['./admin-lottery-report.component.css']
})
export class AdminLotteryReportComponent {
  displayedColumns: string[] = ['date', 'name', 'lottery', 'amount', 'price'];
  dataSource = new MatTableDataSource<Purchase>([]);

  months: string[] = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

  selectedMonth: string = '';
  allLResults: any;
  selectedDate: Date | null = null;
  selectedYear: number = new Date().getFullYear();

  // เพิ่มตัวแปร hasSearchResults เพื่อตรวจสอบว่ามีผลลัพธ์การค้นหาหรือไม่
  hasSearchResults: boolean = true;

  constructor(private cartService: CartService, private router: Router, private http: HttpClient, public data: LotteryService) {
    this.http.get(this.data.apiEndpoint + "/purchase").subscribe(
      (response) => {
        this.allLResults = response;
        this.dataSource.data = this.allLResults;
      },
      (error) => {
        console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล: " + JSON.stringify(error));
      }
    );
  }
  resetSearch() {
    // รีเซ็ตค่าทุกอย่างเป็นค่าเริ่มต้น
    this.selectedDate = null;
    this.selectedMonth = '';
    this.selectedYear = new Date().getFullYear();
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
  
  filterDataByMonthYear() {
    if (!this.selectedMonth || !this.selectedYear) {
      // แสดง SweetAlert2 ถ้าไม่ได้ป้อนข้อมูลและกดค้นหา
      Swal.fire({
        icon: 'info',
        title: 'กรุณาป้อนข้อมูล',
        text: 'โปรดเลือกเดือนและปีก่อนค้นหา',
      });
      return; // ไม่ดำเนินการต่อไปถ้าไม่ได้ป้อนข้อมูล
    }
  
    this.dataSource.data = this.allLResults.filter((purchase: Purchase) => {
      const purchaseDate = new Date(purchase.created_at);
      return (
        purchaseDate.getMonth() === this.months.indexOf(this.selectedMonth) &&
        purchaseDate.getFullYear() === this.selectedYear
      );
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
