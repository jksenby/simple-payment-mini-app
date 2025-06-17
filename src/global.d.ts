declare global {
    interface Window {
      Telegram?: {
        WebApp: {
          initDataUnsafe: {
            user?: {
              id: number;
              first_name?: string;
              last_name?: string;
              username?: string;
              language_code?: string;
              is_premium?: boolean;
            };
          };
          MainButton: {
            show: () => void;
            hide: () => void;
            setText: (text: string) => void;
            onClick: (callback: () => void) => void;
            offClick: (callback: () => void) => void;
            enable: () => void;
            disable: () => void;
          };
          BackButton: {
            show: () => void;
            hide: () => void;
            onClick: (callback: () => void) => void;
            offClick: (callback: () => void) => void;
          };
          sendData: (data: string) => void;
          ready: () => void;
          expand: () => void;
          close: () => void;
        };
      };
    }
  }