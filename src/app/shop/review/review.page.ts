import { Component, effect, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar } from '@ionic/angular';

import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { AppCheckboxComponent } from '../../shared/ui/app-checkbox/app-checkbox.component';
import { StepsComponent } from '../steps.component';

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['../shop.scss', './review.page.scss'],
  imports: [IonToolbar, IonHeader, IonContent, ReactiveFormsModule, AppCheckboxComponent, StepsComponent],
})
export class ReviewPage {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  readonly cart = inject(CartService);
  readonly checkout = inject(CheckoutService);

  readonly terms = new FormControl(false, { nonNullable: true, validators: Validators.requiredTrue });

  constructor() {
    effect(() => {
      if (this.cart.items().length === 0 && !this.checkout.lastOrder()) {
        void this.router.navigateByUrl('/cart', { replaceUrl: true });
      }
    });
  }

  get initials(): string {
    return (
      this.checkout
        .recipient()
        .name.split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join('') || '?'
    );
  }

  get firstName(): string {
    return this.checkout.recipient().name.split(/\s+/)[0] ?? '';
  }

  get sender(): string {
    return this.auth.mobile() ?? 'Sender shown after login';
  }

  back(): void {
    void this.router.navigateByUrl('/payment');
  }

  confirm(): void {
    this.terms.markAsTouched();
    if (this.terms.invalid) {
      return;
    }
    if (!this.auth.isLoggedIn()) {
      void this.router.navigateByUrl('/complete-purchase');
      return;
    }
    this.checkout.place(this.auth.mobile());
    void this.router.navigateByUrl('/payment-success', { replaceUrl: true });
  }
}
