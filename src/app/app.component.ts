import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TelegramService } from './services/telegram.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  user: any;
  constructor(private telegramService: TelegramService) {
    
  }

  ngOnInit(): void {
    this.telegramService.ready();

    console.log(this.telegramService.UserData)
    this.user = this.telegramService.UserData;
  }
}
