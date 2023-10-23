import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';
import { LotterySearchComponent } from './components/lottery-search/lottery-search.component';
import { ManageLotteryComponent } from './components/manage-lottery/manage-lottery.component';
import { RegisterComponent } from './components/register/register.component';
import { LotteryDetailComponent } from './components/lottery-detail/lottery-detail.component';

import {HomeComponent} from './components/home/home.component';
import { MemberComponent } from './components/member/member.component';
import { CartComponent } from './components/cart/cart.component';

import { AdminLotteryReportComponent } from './components/admin-lottery-report/admin-lottery-report.component';

import { PurchaseHistoryComponent } from './components/purchase-history/purchase-history.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'dashboard',
    component: DashboardAdminComponent,
    // canActivate: ['adminPermission'],
  },
  {
    path: 'lottery-search',
    component: LotterySearchComponent,
    // canActivate: ['adminPermission', 'userPermission'],
  },
  {
    path: 'manage-lottery',
    component: ManageLotteryComponent,
    // canActivate: ['adminPermission'],
  },
  {
    path: 'register',
    component: RegisterComponent,
    // canActivate: ['userPermission'],
  },
  {
    path: 'lottery-detail',
    component: LotteryDetailComponent,
    // canActivate: ['memberPermission'],
  },

  {
    path: 'login',
    component: LoginComponent,
    // canActivate: ['userPermission', 'adminPermission'],
  },
  {
    path: 'member',
    component: MemberComponent,
    // canActivate: ['userPermission', 'adminPermission'],
  },
  {
    path: 'cart',
    component: CartComponent,
    // canActivate: ['userPermission', 'adminPermission'],
  },

  {
    path: 'report',
    component: AdminLotteryReportComponent,
    // canActivate: ['userPermission', 'adminPermission'],
  },
  {
    path: 'purchase-history',
    component: PurchaseHistoryComponent,
    // canActivate: ['userPermission', 'adminPermission'],
  },


 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
