import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';

import { AuthService } from '../../core/services/auth.service';
import { AppButtonComponent } from '../../shared/ui/app-button/app-button.component';
import { AppCheckboxComponent } from '../../shared/ui/app-checkbox/app-checkbox.component';
import { AppInputComponent } from '../../shared/ui/app-input/app-input.component';
import { MOBILE_PATTERN, matchControls } from '../validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['../auth.page.scss'],
  imports: [ReactiveFormsModule, RouterLink, IonContent, AppInputComponent, AppButtonComponent, AppCheckboxComponent],
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly error = signal('');

  readonly form = this.fb.nonNullable.group(
    {
      mobile: ['', [Validators.required, Validators.pattern(MOBILE_PATTERN)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', Validators.required],
      terms: [false, Validators.requiredTrue],
    },
    { validators: matchControls('password', 'confirm') },
  );

  back(): void {
    void this.router.navigateByUrl('/home');
  }

  submit(): void {
    this.error.set('');
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    if (!this.auth.register(this.form.controls.mobile.value)) {
      this.error.set('This mobile number is already registered.');
      return;
    }
    void this.router.navigate(['/login'], { replaceUrl: true, queryParamsHandling: 'preserve' });
  }
}
