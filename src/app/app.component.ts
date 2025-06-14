import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TelegramService } from './services/telegram.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  user: any;
  constructor(private telegramService: TelegramService) {
    telegramService.ready();

    console.log(telegramService.UserData())
    this.user = telegramService.UserData();
  }
}
