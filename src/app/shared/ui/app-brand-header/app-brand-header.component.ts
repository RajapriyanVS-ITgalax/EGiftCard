import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, MenuController } from '@ionic/angular';

import { AuthService } from '../../../core/services/auth.service';
import { LogoutService } from '../../../core/services/logout.service';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-brand-header',
  imports: [RouterLink, IonHeader, IonToolbar],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <div class="bar">
          @if (auth.isLoggedIn()) {
            <button type="button" class="hamburger" aria-label="Open menu" (click)="openMenu()">
              <i class="ri-menu-line"></i>
            </button>
          }
          @if (!auth.isLoggedIn()) {
            <span class="brand w70-end">
              <img src="assets/images/logo.png" alt="" />
              Kauwai<small>EGift</small></span
            >
          }
          @if (auth.isLoggedIn()) {
            <span class="brand" style="padding-left: 20px;">
              <img src="assets/images/logo.png" alt="" />
              Kauwai<small>EGift</small></span
            >
          }
          <span class="w50-end d-flex gap-10">
            @if (auth.isLoggedIn()) {
              <a class="bell" routerLink="/notifications" aria-label="Notifications">
                <i class="ri-notification-3-line"></i>
                @if (profile.unreadCount() > 0) {
                  <b></b>
                }
              </a>
              <button type="button" class="user-chip" routerLink="/profile" aria-label="Profile">
                <span class="avatar">{{ profile.initials() }}</span
                ><i class="ri-arrow-down-s-line"></i>
              </button>
            } @else {
              <button type="button" class="login" routerLink="/login">Log in</button>
            }
          </span>
        </div>
      </ion-toolbar>
    </ion-header>
  `,
  styles: `
    .bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
    }
    .hamburger {
      padding: 0;
      border: 0;
      background: none;
      color: var(--ion-color-primary);
      font-size: 20px;
      line-height: 1;
    }
    .w50-end {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .bell {
      position: relative;
      color: var(--ion-color-primary);
      font-size: 22px;
      text-decoration: none;
    }
    .bell b {
      position: absolute;
      top: 0;
      right: 0;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--ion-color-accent);
    }
    .user-chip {
      display: flex;
      align-items: center;
      gap: 2px;
      padding: 2px 6px 2px 2px;
      border: 1px solid #cfdbe8;
      border-radius: 999px;
      background: #fff;
      color: var(--ion-color-primary);
    }
    .avatar {
      display: grid;
      place-items: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--ion-color-primary);
      color: #fff;
      font-size: 10px;
      font-weight: 700;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 18px;
      font-weight: 600;
      color: var(--ion-color-primary);
    }
    .brand img {
      height: 25px;
    }
    .brand small {
      margin-left: -2px;
      font-size: inherit;
      color: var(--ion-color-secondary);
    }
    .login {
      border: 1px solid rgba(255, 255, 255, 0.7);
      border-radius: 999px;
      padding: 6px 14px;
      background: var(--ion-color-primary);
      color: #fff;
      font-weight: 600;
    }
  `,
})
export class AppBrandHeaderComponent {
  readonly auth = inject(AuthService);
  readonly logout = inject(LogoutService);
  readonly profile = inject(ProfileService);
  private readonly menu = inject(MenuController);

  openMenu(): void {
    void this.menu.open();
  }
}
