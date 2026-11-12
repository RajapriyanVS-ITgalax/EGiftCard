import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonContent, IonMenu, IonRouterOutlet, MenuController } from '@ionic/angular';

import { AuthService } from './core/services/auth.service';
import { LogoutService } from './core/services/logout.service';
import { ProfileService } from './core/services/profile.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonMenu, IonContent, IonRouterOutlet, RouterLink, RouterLinkActive],
  styles: `
    .drawer {
      --width: 78%;
      --max-width: 320px;
    }
    .drawer-body {
      min-height: 100%;
      box-sizing: border-box;
      padding: 24px 14px;
      background: linear-gradient(180deg, #0a5aa6, #06336a);
      color: #fff;
      font-family: 'Poppins', sans-serif;
    }
    .drawer-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .drawer-top img {
      height: 26px;
    }
    .drawer-top .x {
      border: 0;
      background: none;
      color: #fff;
      font-size: 26px;
      line-height: 1;
    }
    .drawer-user {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 22px;
      color: #fff;
      text-decoration: none;
    }
    .drawer-user .avatar {
      display: grid;
      place-items: center;
      width: 52px;
      height: 52px;
      flex: none;
      border: 2px solid #fff;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.18);
      font-weight: 700;
    }
    .drawer-user b {
      display: block;
      font-size: 15px;
    }
    .drawer-user small {
      font-size: 12px;
      opacity: 0.85;
    }
    .drawer-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .drawer-list a,
    .drawer-list button {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 10px;
      border: 0;
      border-radius: 12px;
      background: none;
      color: #fff;
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      text-align: left;
      text-decoration: none;
    }
    .drawer-list i:first-child {
      font-size: 18px;
    }
    .drawer-list .chev {
      margin-left: auto;
      opacity: 0.7;
      font-size: 18px;
    }
    .drawer-list a.active {
      background: #0a7ae0;
      font-weight: 700;
    }
  `,
})
export class AppComponent {
  readonly auth = inject(AuthService);
  readonly logout = inject(LogoutService);
  readonly profile = inject(ProfileService);
  readonly menuItems = [
    { label: 'Dashboard', icon: 'ri-home-5-line', path: '/home' },
    { label: 'Gift Cards', icon: 'ri-gift-line', path: '/gift-cards' },
    { label: 'Wallet', icon: 'ri-wallet-3-line', path: '/wallet' },
    { label: 'Contacts', icon: 'ri-contacts-line', path: '/contacts' },
    { label: 'Notifications', icon: 'ri-notification-3-line', path: '/notifications' },
    { label: 'Help & Support', icon: 'ri-question-line', path: '/help' },
    { label: 'Settings', icon: 'ri-settings-3-line', path: '/settings' },
  ];
  private readonly menu = inject(MenuController);

  closeMenu(): void {
    void this.menu.close();
  }
}
