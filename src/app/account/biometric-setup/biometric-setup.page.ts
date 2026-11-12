import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular';

import { AuthService } from '../../core/services/auth.service';
import { BiometricService } from '../../core/services/biometric.service';

@Component({
  selector: 'app-biometric-setup',
  imports: [IonContent],
  template: `
    <ion-content [fullscreen]="true">
      <div class="page">
        <div class="brand">
          <img src="assets/images/logo.png" alt="" />
          <span>Kauwai <small>EGift</small></span>
        </div>

        <div class="icon"><i class="ri-fingerprint-line"></i></div>
        <h1>Faster login next time?</h1>
        <p class="sub">
          Use your fingerprint or Face ID to log in to <b>Kauwai</b> EGift on this phone.
        </p>

        @if (error()) {
          <p class="error">{{ error() }}</p>
        }

        <button type="button" class="turn-on" [disabled]="busy()" (click)="turnOn()">
          {{ busy() ? 'Please wait…' : 'Turn on biometric login' }}
        </button>
        <button type="button" class="later" (click)="skip()">Not now</button>
      </div>
    </ion-content>
  `,
  styles: `
    ion-content {
      --background: #fff;
    }
    .page {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100%;
      box-sizing: border-box;
      padding: 56px 28px 32px;
      text-align: center;
      font-family: 'Poppins', sans-serif;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 32px;
      font-size: 24px;
      font-weight: 700;
      color: var(--ion-color-primary);
    }
    .brand img {
      height: 40px;
    }
    .brand small {
      font-size: inherit;
      color: var(--ion-color-secondary);
    }
    .icon {
      display: grid;
      place-items: center;
      width: 96px;
      height: 96px;
      margin-bottom: 24px;
      border-radius: 50%;
      background: #d9eaf8;
      color: var(--ion-color-primary);
      font-size: 52px;
    }
    h1 {
      margin: 0 0 12px;
      font-size: 22px;
      color: var(--ion-color-primary);
    }
    .sub {
      margin: 0 0 32px;
      max-width: 300px;
      font-size: 13px;
      line-height: 1.5;
      color: #33475b;
    }
    .sub b {
      color: var(--ion-color-accent);
    }
    .error {
      margin: 0 0 12px;
      font-size: 12px;
      color: var(--ion-color-danger);
    }
    .turn-on {
      width: 100%;
      max-width: 340px;
      padding: 14px;
      border: 0;
      border-radius: 999px;
      background: linear-gradient(180deg, #ffa53a, var(--ion-color-accent));
      color: #fff;
      font: inherit;
      font-weight: 600;
      box-shadow: 0 6px 14px rgba(247, 148, 29, 0.35);
    }
    .turn-on:disabled {
      opacity: 0.6;
    }
    .later {
      margin-top: 18px;
      border: 0;
      background: none;
      color: var(--ion-color-primary);
      font: inherit;
      font-weight: 600;
      text-decoration: underline;
    }
  `,
})
export class BiometricSetupPage {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  private readonly biometric = inject(BiometricService);
  private readonly toast = inject(ToastController);

  readonly busy = signal(false);
  readonly error = signal('');

  async turnOn(): Promise<void> {
    const mobile = this.auth.mobile();
    if (!mobile) {
      this.skip();
      return;
    }
    this.error.set('');
    this.busy.set(true);
    const ok = await this.biometric.enable(mobile);
    this.busy.set(false);
    if (!ok) {
      this.error.set('Could not enable biometric login. You can try again from Settings.');
      return;
    }
    const t = await this.toast.create({ message: 'Biometric login turned on', duration: 1800, position: 'bottom' });
    void t.present();
    this.skip();
  }

  skip(): void {
    const redirect = this.route.snapshot.queryParamMap.get('redirect');
    void this.router.navigateByUrl(redirect?.startsWith('/') ? redirect : '/home', { replaceUrl: true });
  }
}
