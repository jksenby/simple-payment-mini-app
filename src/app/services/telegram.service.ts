import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { User } from '../types/user.interface';

@Injectable({ providedIn: 'root' })
export class TelegramService {
  private tg: any;
  private readonly isDevMode: boolean;

  constructor(@Inject(DOCUMENT) private _document: Document) {
    const win: any = this._document.defaultView || window;
    this.tg = win['Telegram']?.WebApp;
    this.isDevMode = !win['Telegram']?.WebApp?.initDataUnsafe?.user;
    if (this.isDevMode) {
      this.initializeMockTelegram(win);
    }
  }

  get MainButton() {
    return this.tg?.MainButton;
  }

  get BackButton() {
    return this.tg?.BackButton;
  }

  get UserData() {
    return this.isDevMode ? this.mockUser : this.tg?.initDataUnsafe?.user;
  }

  sendData(data: object) {
    if (this.isDevMode) {
      console.log('[DEV] Data sent:', data);
      if (this.mockButtonClick) {
        this.mockButtonClick();
      }
      return;
    }
    this.tg?.sendData(JSON.stringify(data));
  }

  ready() {
    if (this.isDevMode) {
      console.log('[DEV] Telegram WebApp ready');
      return;
    }
    this.tg?.ready();
  }

  private initializeMockTelegram(win: any) {
    win['Telegram'] = {
      WebApp: {
        initDataUnsafe: {
          user: this.mockUser
        },
        MainButton: {
          show: () => console.log('[MOCK] MainButton shown'),
          hide: () => console.log('[MOCK] MainButton hidden'),
          setText: (text: string) => console.log(`[MOCK] Button text set to: ${text}`),
          onClick: (callback: () => void) => {
            console.log('[MOCK] MainButton click handler registered');
            this.mockButtonClick = callback;
          },
          offClick: () => console.log('[MOCK] MainButton click handler removed'),
          enable: () => console.log('[MOCK] MainButton enabled'),
          disable: () => console.log('[MOCK] MainButton disabled'),
          setParams: (params: any) => console.log('[MOCK] MainButton params:', params)
        },
        BackButton: {
          show: () => console.log('[MOCK] BackButton shown'),
          hide: () => console.log('[MOCK] BackButton hidden'),
          onClick: (callback: () => void) => console.log('[MOCK] BackButton click handler registered'),
          offClick: () => console.log('[MOCK] BackButton click handler removed')
        },
        sendData: (data: string) => console.log('[MOCK] Data sent:', data),
        ready: () => console.log('[MOCK] WebApp ready'),
        expand: () => console.log('[MOCK] WebApp expanded'),
        close: () => console.log('[MOCK] WebApp closed')
      }
    };
    this.tg = win['Telegram']?.WebApp;
  }

  private mockButtonClick: () => void = () => {};
  private readonly mockUser: User = {
    id: 123456789,
    first_name: 'Dev_User',
    username: 'dev_test',
    language_code: 'en',
    is_premium: true,
    photo_url: '../../assets/alien.jpg'
  };
}