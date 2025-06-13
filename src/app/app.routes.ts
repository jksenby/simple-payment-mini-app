import { Routes } from '@angular/router';
import { PaymentComponent } from './components/payment/payment.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/payment' },
  { path: 'payment', component: PaymentComponent },
];
