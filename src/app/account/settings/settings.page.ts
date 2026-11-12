import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular';

import { AuthService } from '../../core/services/auth.service';
import { BiometricService } from '../../core/services/biometric.service';
import { ProfileService } from '../../core/services/profile.service';
import { AppPageHeaderComponent } from '../../shared/ui/app-page-header/app-page-header.component';

@Component({
  selector: 'app-settings',
  imports: [IonContent, RouterLink, AppPageHeaderComponent],
  styleUrls: ['../account.scss'],
  template: `
    <app-page-header title="Settings" (back)="location.back()"></app-page-header>
    <ion-content [fullscreen]="true">
      <div class="wrap">
        <ul class="rows">
          <li>
            <div class="row">
              <i class="ri-notification-3-line lead"></i><span class="grow">Push notifications</span>
              <button type="button" class="toggle" role="switch" aria-label="Push notifications"
                [class.on]="profile.pushEnabled()" [attr.aria-checked]="profile.pushEnabled()"
                (click)="profile.setPush(!profile.pushEnabled())"></button>
            </div>
          </li>
          <li>
            <div class="row">
              <i class="ri-fingerprint-line lead"></i><span class="grow">Biometric login</span>
              <button type="button" class="toggle" role="switch" aria-label="Biometric login"
                [class.on]="biometric.enabled()" [attr.aria-checked]="biometric.enabled()"
                (click)="toggleBiometric()"></button>
            </div>
          </li>
          <li>
            <a routerLink="/security"><i class="ri-shield-line lead"></i>Security<i class="ri-arrow-right-s-line chev"></i></a>
          </li>
          <li>
            <a routerLink="/personal-info"><i class="ri-user-line lead"></i>Personal Information<i class="ri-arrow-right-s-line chev"></i></a>
          </li>
          <li>
            <a routerLink="/terms"><i class="ri-file-text-line lead"></i>Terms &amp; Conditions<i class="ri-arrow-right-s-line chev"></i></a>
          </li>
          <li>
            <a routerLink="/privacy"><i class="ri-lock-line lead"></i>Privacy Policy<i class="ri-arrow-right-s-line chev"></i></a>
          </li>
          <li>
            <div class="row"><i class="ri-information-line lead"></i><span class="grow">App version</span><small>1.0.0</small></div>
          </li>
        </ul>
      </div>
    </ion-content>
  `,
})
export class SettingsPage {
  readonly location = inject(Location);
  readonly profile = inject(ProfileService);
  readonly biometric = inject(BiometricService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastController);

  async toggleBiometric(): Promise<void> {
    if (this.biometric.enabled()) {
      this.biometric.disable();
      await this.notify('Biometric login turned off');
      return;
    }
    const mobile = this.auth.mobile();
    if (mobile && (await this.biometric.enable(mobile))) {
      await this.notify('Biometric login turned on');
    } else {
      await this.notify('Could not enable biometric login');
    }
  }

  private async notify(message: string): Promise<void> {
    const t = await this.toast.create({ message, duration: 1800, position: 'bottom' });
    await t.present();
  }
}
