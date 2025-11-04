import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { SubscriptionRequest } from '../types/subscription.interface';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  public createPayment(): Observable<any> {
    return this.http.get<any>('payments/create-checkout-session');
  }

  public createSubscription(data: SubscriptionRequest): Observable<any> {
    return this.http.post<any>('payments/create-subscription', data);
  }
}
