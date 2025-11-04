import { Component, OnInit } from '@angular/core';
import { TelegramService } from '../../services/telegram.service';
import { User } from '../../types/user.interface';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { ErrorStateMatcher } from '@angular/material/core';
import { PaymentService } from '../../services/payment.service';
import { subscription } from '../../types/price.const';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
@Component({
  selector: 'app-payment',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButton,
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent implements OnInit {
  user: User | null = null;
  subscriptionForm!: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(
    private telegramService: TelegramService,
    private fb: FormBuilder,
    private paymentService: PaymentService,
  ) {
  }

  ngOnInit(): void {
    this.telegramService.ready();

    console.log('User Data:', this.telegramService.UserData);

    if (this.telegramService.UserData) {
      this.user = this.telegramService.UserData;
    }
    this.initForm();
  }

  private initForm() {
    this.subscriptionForm = this.fb.group({
      email: this.fb.control('', [Validators.required,]),
      priceId: this.fb.control(subscription, [Validators.required,]),
    });
  }

  public onBuy() {
    this.paymentService.createPayment().subscribe({
      next: (res) => {
        if(res)
          window.location.href = res.url;
      },
      error: (err) => {
        console.error('Error creating checkout session:', err);
      },
    });
  }

  public onSubscribe() {
    this.paymentService.createSubscription({
      email: this.subscriptionForm.get('email')?.value,
      price_id: this.subscriptionForm.get('priceId')?.value
    }).subscribe({
      next: (res) => {
        if(res)
          window.location.href = res.url;
      },
      error: (err) => {
        console.error('Error creating checkout session:', err);
      },
    });
  }
}
