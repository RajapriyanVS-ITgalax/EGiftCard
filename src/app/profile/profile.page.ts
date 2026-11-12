import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonFooter } from '@ionic/angular';

import { AuthService } from '../core/services/auth.service';
import { LogoutService } from '../core/services/logout.service';
import { ProfileService } from '../core/services/profile.service';
import { AppPageHeaderComponent } from '../shared/ui/app-page-header/app-page-header.component';
import { AppTabBarComponent } from '../shared/ui/app-tab-bar/app-tab-bar.component';

@Component({
  selector: 'app-profile',
  imports: [IonContent, IonFooter, RouterLink, AppTabBarComponent, AppPageHeaderComponent],
  styleUrls: ['../account/account.scss'],
  template: `
    <app-page-header title="Profile" (back)="location.back()">
      <a routerLink="/settings" class="header-settings" aria-label="Settings"><i class="ri-settings-3-line"></i></a>
      <img class="header-logo" src="assets/images/logo.png" alt="Kauwai EGift" />
    </app-page-header>

    <ion-content [fullscreen]="true">
      <div class="wrap">
        <div class="who">
          <span class="avatar big">{{ profile.initials() }}</span>
          <div>
            <h2>{{ profile.profile().name }}</h2>
            <p>{{ profile.phone() || 'Guest' }}</p>
          </div>
        </div>

        <ul class="rows">
          <li>
            <a routerLink="/personal-info"
              ><i class="ri-user-line lead"></i>Personal Information<i class="ri-arrow-right-s-line chev"></i
            ></a>
          </li>
          <li>
            <a routerLink="/contact-details"
              ><i class="ri-phone-line lead"></i>Contact Details<i class="ri-arrow-right-s-line chev"></i
            ></a>
          </li>
          <li>
            <div class="row">
              <i class="ri-notification-3-line lead"></i><span class="grow">Notifications</span>
              <button
                type="button"
                class="toggle"
                role="switch"
                aria-label="Notifications"
                [class.on]="profile.pushEnabled()"
                [attr.aria-checked]="profile.pushEnabled()"
                (click)="profile.setPush(!profile.pushEnabled())"
              ></button>
            </div>
          </li>
          <li>
            <a routerLink="/security"
              ><i class="ri-shield-line lead"></i>Security<i class="ri-arrow-right-s-line chev"></i
            ></a>
          </li>
          <li>
            <a routerLink="/help"
              ><i class="ri-question-line lead"></i>Help &amp; Support<i class="ri-arrow-right-s-line chev"></i
            ></a>
          </li>
          <li>
            <a routerLink="/terms"
              ><i class="ri-file-text-line lead"></i>Terms &amp; Conditions<i class="ri-arrow-right-s-line chev"></i
            ></a>
          </li>
          <li>
            <a routerLink="/privacy"
              ><i class="ri-lock-line lead"></i>Privacy Policy<i class="ri-arrow-right-s-line chev"></i
            ></a>
          </li>
        </ul>

        <button type="button" class="btn danger logout" (click)="logout.confirm()">Log Out</button>
      </div>
    </ion-content>

    <ion-footer><app-tab-bar></app-tab-bar></ion-footer>
  `,
  styles: `
    .header-settings {
      color: var(--ion-color-primary);
      font-size: 20px;
      line-height: 1;
    }
    .header-logo {
      width: 28px;
      height: 28px;
      object-fit: contain;
    }
    .top {
      display: grid;
      grid-template-columns: 56px 1fr 72px;
      align-items: center;
      padding: 14px 12px 10px;
      border-bottom: 1px solid #e3e8ee;
      background: #fff;
      font-family: 'Poppins', sans-serif;
    }
    .top h1 {
      margin: 0;
      text-align: center;
      font-size: 18px;
      font-weight: 700;
      color: var(--ion-color-primary);
    }
    .icon {
      border: 0;
      background: none;
      padding: 0;
      font-size: 26px;
      line-height: 1;
      color: var(--ion-color-primary);
    }
    .right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
    }
    .right .icon {
      font-size: 20px;
    }
    .right img {
      height: 24px;
    }
    .who {
      display: flex;
      align-items: center;
      gap: 14px;
      margin: 8px 0 14px;
    }
    .big {
      width: 72px;
      height: 72px;
      font-size: 26px;
    }
    .who h2 {
      margin: 0;
      font-size: 17px;
      font-weight: 700;
      color: var(--ion-color-primary);
    }
    .who p {
      margin: 2px 0 0;
      font-size: 13px;
      color: var(--ion-color-medium);
    }
    .logout {
      margin-top: 24px;
    }
  `,
})
export class ProfilePage {
  readonly auth = inject(AuthService);
  readonly logout = inject(LogoutService);
  readonly profile = inject(ProfileService);
  readonly location = inject(Location);
}
