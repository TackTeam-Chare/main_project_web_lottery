import { Injectable } from '@angular/core';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetalertService {

  constructor() { }

  // Method สำหรับแสดง Success Alert
  showSuccessAlert(title: string, message: string) {
    Swal.fire({
      icon: 'success',
      title: title,
      text: message,
    });
  }

  // Method สำหรับแสดง Error Alert
  showErrorAlert(title: string, message: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
    });
  }

}
