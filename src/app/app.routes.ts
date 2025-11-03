import { Routes } from '@angular/router';
import { PaymentComponent } from './components/payment/payment.component';
import { SuccessComponent } from './components/success/success.component';
import { CancelComponent } from './components/cancel/cancel.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/payment' },
  { path: 'payment', component: PaymentComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'cancel', component: CancelComponent },
];
