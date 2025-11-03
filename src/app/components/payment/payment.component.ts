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
import { NgxMaskDirective } from 'ngx-mask';
import { PaymentService } from '../../services/payment.service';

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
    NgxMaskDirective,
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent implements OnInit {
  user: User | null = null;
  paymentForm!: FormGroup;
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
    this.paymentForm = this.fb.group({
      username: this.fb.control(this.user?.username ?? '', [Validators.required,]),
      fullName: this.fb.control(this.user?.first_name ?? this.user?.last_name ?? '', [Validators.required]),
      cardNumber: this.fb.control('', [Validators.required]),
      cardExpiration: this.fb.control(null, [Validators.required]),
      cvv: this.fb.control('', Validators.required),
      amount: this.fb.control(0, Validators.required),
    });
  }

  public onSubmit() {
    this.paymentService.createPayment(this.paymentForm.value).subscribe({
      next: (res) => {
        window.location.href = res.url;
      },
      error: (err) => {
        console.error('Error creating checkout session:', err);
      },
    });
  }
}
