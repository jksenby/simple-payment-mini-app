import { Component, OnInit } from '@angular/core';
import { TelegramService } from '../../services/telegram.service';
import { User } from '../../types/user.interface';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  user: User | null = null;

  constructor(private telegramService: TelegramService) {}

  ngOnInit(): void {
    this.telegramService.ready();
  
    console.log('User Data:', this.telegramService.UserData);
  
    if(this.telegramService.UserData) {
      this.user = this.telegramService.UserData
    }
  }

}
