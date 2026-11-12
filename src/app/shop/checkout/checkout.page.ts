import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar } from '@ionic/angular';

import { MOBILE_PATTERN } from '../../auth/validators';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import type { RecipientMode } from '../../core/services/checkout.service';
import { AppInputComponent } from '../../shared/ui/app-input/app-input.component';
import { StepsComponent } from '../steps.component';
import { AppBrandHeaderComponent } from '../../shared/ui/app-brand-header/app-brand-header.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['../shop.scss', './checkout.page.scss'],
  imports: [
    IonToolbar,
    IonHeader,
    IonContent,
    ReactiveFormsModule,
    AppInputComponent,
    StepsComponent,
    AppBrandHeaderComponent,
  ],
})
export class CheckoutPage {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly cart = inject(CartService);
  private readonly checkout = inject(CheckoutService);

  readonly maxMessage = 160;
  readonly mode = this.checkout.recipient;

  readonly form = this.fb.nonNullable.group({
    name: [this.checkout.recipient().name, Validators.required],
    mobile: [this.checkout.recipient().mobile, [Validators.required, Validators.pattern(MOBILE_PATTERN)]],
    message: [this.checkout.recipient().message, Validators.maxLength(this.maxMessage)],
  });

  constructor() {
    effect(() => {
      if (this.cart.items().length === 0) {
        void this.router.navigateByUrl('/cart', { replaceUrl: true });
      }
    });
  }

  setMode(mode: RecipientMode): void {
    this.checkout.recipient.update((r) => ({ ...r, mode }));
  }

  back(): void {
    void this.router.navigateByUrl('/cart');
  }

  next(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.checkout.recipient.update((r) => ({ ...r, ...this.form.getRawValue() }));
    void this.router.navigateByUrl('/payment');
  }
}
