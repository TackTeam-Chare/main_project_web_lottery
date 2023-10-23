import { Injectable } from '@angular/core';
import { MemberDataService } from './member-data.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LotteryService {
  
  apiEndpoint = 'http://localhost/Webservice';
  isLoggedIn: boolean = false;
  isMultiple = false;
  lotteriesByNumber: any;
  // static apiEndpoint: string;
  selectedLotteries: Lottery[] = [];
  // lottery =new Lottery();
  constructor(private memberDataService :MemberDataService,
    private http :HttpClient) { }
  setMemberName(name: string) {
    this.memberDataService.setMemberName(name);
  }
}
class Lottery implements Lottery{
  
  id: number = 0;
  ticket_number: number = 0;
  price: number = 0;
  // quantity:number=0;
  period: number = 0;
  set_number: number = 0;
  created_at: string = '';
  updated_at: string = '';
  isSelected?: boolean;
  [key: string]: any;
  quantity?: number;
  
}
