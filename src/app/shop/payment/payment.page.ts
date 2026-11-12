import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonToolbar, IonHeader } from '@ionic/angular';

import { CheckoutService } from '../../core/services/checkout.service';
import type { PaymentMethod } from '../../core/services/checkout.service';
import { StepsComponent } from '../steps.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['../shop.scss', './payment.page.scss'],
  imports: [IonHeader, IonToolbar, IonContent, StepsComponent],
})
export class PaymentPage {
  private readonly router = inject(Router);
  readonly checkout = inject(CheckoutService);

  readonly methods: { id: PaymentMethod; hint: string; icon: string }[] = [
    { id: 'mPaisa', hint: 'Pay with your mPaisa account', icon: 'ri-smartphone-line' },
    { id: 'M-Cash', hint: 'Pay with your M-Cash wallet', icon: 'ri-wallet-3-line' },
    { id: 'Visa / Mastercard', hint: 'Pay securely with your card', icon: 'ri-bank-card-line' },
  ];

  back(): void {
    void this.router.navigateByUrl('/checkout');
  }

  next(): void {
    void this.router.navigateByUrl('/review');
  }
}
