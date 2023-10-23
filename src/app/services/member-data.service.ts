import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MemberDataService {
  private memberName: string | null = null;

  setMemberName(name: string) {
    this.memberName = name;
  }

  getMemberName(): string | null {
    return this.memberName;
  }
  clearMemberName() {
  this.memberName = null;
}

  constructor() { }
}
