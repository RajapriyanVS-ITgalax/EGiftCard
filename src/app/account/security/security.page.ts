import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonContent, ToastController } from '@ionic/angular';

import { AuthService } from '../../core/services/auth.service';
import { BiometricService } from '../../core/services/biometric.service';
import { LogoutService } from '../../core/services/logout.service';
import { AppPageHeaderComponent } from '../../shared/ui/app-page-header/app-page-header.component';

@Component({
  selector: 'app-security',
  imports: [IonContent, AppPageHeaderComponent],
  styleUrls: ['../account.scss'],
  template: `
    <app-page-header title="Security" (back)="location.back()"></app-page-header>
    <ion-content [fullscreen]="true">
      <div class="wrap">
        <ul class="rows">
          <li>
            <div class="row">
              <i class="ri-fingerprint-line lead"></i>
              <span class="grow">Biometric login<br /><small>Fingerprint or Face ID</small></span>
              <button type="button" class="toggle" role="switch" aria-label="Biometric login"
                [class.on]="biometric.enabled()" [attr.aria-checked]="biometric.enabled()"
                (click)="toggleBiometric()"></button>
            </div>
          </li>
          <li>
            <div class="row">
              <i class="ri-lock-password-line lead"></i>
              <span class="grow">Login method<br /><small>One-time 6-digit PIN sent to {{ phone }}</small></span>
            </div>
          </li>
        </ul>
        <p class="note">Never share your PIN with anyone. Kauwai will never ask for it.</p>
        <button type="button" class="btn danger" (click)="logout.confirm()">Log out of this device</button>
      </div>
    </ion-content>
  `,
  styles: `
    small {
      color: var(--ion-color-medium);
      font-size: 11px;
    }
    .note {
      margin: 16px 4px 24px;
      font-size: 12px;
      color: #33475b;
    }
  `,
})
export class SecurityPage {
  readonly location = inject(Location);
  readonly biometric = inject(BiometricService);
  readonly logout = inject(LogoutService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastController);

  get phone(): string {
    return this.auth.mobile() ? '+679 ' + this.auth.mobile() : 'your mobile';
  }

  async toggleBiometric(): Promise<void> {
    let message = 'Biometric login turned off';
    if (this.biometric.enabled()) {
      this.biometric.disable();
    } else {
      const mobile = this.auth.mobile();
      message =
        mobile && (await this.biometric.enable(mobile))
          ? 'Biometric login turned on'
          : 'Could not enable biometric login';
    }
    const t = await this.toast.create({ message, duration: 1800, position: 'bottom' });
    await t.present();
  }
}
