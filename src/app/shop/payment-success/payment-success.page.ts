import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';

import { CheckoutService } from '../../core/services/checkout.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.page.html',
  styleUrls: ['../shop.scss', './payment-success.page.scss'],
  imports: [IonContent],
})
export class PaymentSuccessPage {
  private readonly router = inject(Router);
  readonly order = inject(CheckoutService).lastOrder;

  constructor() {
    if (!this.order()) {
      void this.router.navigateByUrl('/home', { replaceUrl: true });
    }
  }

  next(): void {
    const mine = this.order()?.recipient.mode === 'me';
    void this.router.navigateByUrl(mine ? '/wallet' : '/home', { replaceUrl: true });
  }
}
