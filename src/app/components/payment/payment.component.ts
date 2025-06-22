import { Component, OnInit } from '@angular/core';
import { TelegramService } from '../../services/telegram.service';
import { User } from '../../types/user.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment',
  imports: [ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  user: User | null = null;
  paymentForm!: FormGroup;

  constructor(private telegramService: TelegramService, private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    this.telegramService.ready();
  
    console.log('User Data:', this.telegramService.UserData);
  
    if(this.telegramService.UserData) {
      this.user = this.telegramService.UserData
    }
  }

  private initForm() {
    this.paymentForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      fullName: this.fb.control('', [Validators.required]),
      cardNumber: this.fb.control('', [Validators.required]),
      cardExpiration: this.fb.control(null, [Validators.required]),
      cvv: this.fb.control('', Validators.required)
    })
  }

  public onSubmit() {
    console.log(this.paymentForm)
  }

}
