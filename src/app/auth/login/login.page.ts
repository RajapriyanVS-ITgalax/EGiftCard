import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular';

import { AuthService } from '../../core/services/auth.service';
import { BiometricService } from '../../core/services/biometric.service';
import { AppButtonComponent } from '../../shared/ui/app-button/app-button.component';
import { AppCheckboxComponent } from '../../shared/ui/app-checkbox/app-checkbox.component';
import { AppInputComponent } from '../../shared/ui/app-input/app-input.component';
import { MOBILE_PATTERN } from '../validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['../auth.page.scss'],
  imports: [ReactiveFormsModule, RouterLink, IonContent, AppInputComponent, AppButtonComponent, AppCheckboxComponent],
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastController);
  private readonly biometric = inject(BiometricService);

  readonly pinSent = signal(false);
  readonly errorTrue = signal(false);
  readonly demoPin = signal('');
  readonly error = signal('');

  readonly form = this.fb.nonNullable.group({
    mobile: ['', [Validators.required, Validators.pattern(MOBILE_PATTERN)]],
    pin: [''],
    remember: [true],
  });

  back(): void {
    void this.router.navigateByUrl('/home');
  }

  sendPin(): void {
    this.error.set('');
    const mobile = this.form.controls.mobile;
    if (mobile.invalid) {
      this.errorTrue.set(true);
      return;
    }
    const pin = this.auth.requestPin(mobile.value);
    if (!pin) {
      this.error.set('No account found for this number. Please register first.');
      return;
    }
    this.demoPin.set(pin);
    this.pinSent.set(true);
    this.errorTrue.set(false);
    this.form.controls.pin.setValidators([Validators.required, Validators.pattern(/^\d{6}$/)]);
    this.form.controls.pin.updateValueAndValidity();
  }

  verify(): void {
    this.error.set('');
    if (this.form.invalid) {
      this.errorTrue.set(true);
      return;
    }
    const { mobile, pin, remember } = this.form.getRawValue();
    if (this.auth.verifyPin(mobile, pin, remember)) {
      this.goAfterLogin(!this.biometric.enabled());
    } else {
      this.error.set('Invalid or expired PIN.');
    }
  }

  private goAfterLogin(offerBiometric: boolean): void {
    const redirect = this.route.snapshot.queryParamMap.get('redirect');
    const target = redirect?.startsWith('/') ? redirect : '/home';
    if (offerBiometric) {
      void this.router.navigate(['/biometric-setup'], { replaceUrl: true, queryParams: { redirect: target } });
    } else {
      void this.router.navigateByUrl(target, { replaceUrl: true });
    }
  }

  async loginWithBiometrics(): Promise<void> {
    this.error.set('');
    if (!this.biometric.enabled()) {
      await this.comingSoon('Biometric login is not set up yet. Log in with your PIN, then turn it on');
      return;
    }
    const mobile = await this.biometric.authenticate();
    if (!mobile) {
      this.error.set('Biometric verification failed. Please try again or use your PIN.');
      return;
    }
    this.auth.startSession(mobile, true);
    this.goAfterLogin(false);
  }

  submit(): void {
    if (this.pinSent()) {
      this.verify();
    } else {
      this.sendPin();
    }
  }

  async comingSoon(feature: string): Promise<void> {
    const t = await this.toast.create({ message: `${feature} is coming soon`, duration: 1800, position: 'bottom' });
    await t.present();
  }
}
