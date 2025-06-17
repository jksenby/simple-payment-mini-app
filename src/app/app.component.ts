import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TelegramService } from './services/telegram.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  user: any;
  showBrowserFallbackButton: boolean = false;
  constructor(public telegramService: TelegramService) {}

  ngOnInit() {
    this.telegramService.ready();
  
    console.log('User Data:', this.telegramService.UserData);
  
  if (this.telegramService.UserData) {
    const mainButton = this.telegramService.MainButton;
    if (mainButton) {
      mainButton.setText('PAY $10');
      mainButton.onClick(() => this.handlePayment());
      mainButton.show();
    } else {
      console.warn('MainButton not available - running in browser mode');
      this.showBrowserFallbackButton = true;
    }
  }
  }

  handlePayment() {
    const paymentData = {
      userId: this.telegramService.UserData?.id,
      amount: 10,
      item: 'Premium Subscription'
    };

    this.telegramService.sendData(paymentData);
  }
}
