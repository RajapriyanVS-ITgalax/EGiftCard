import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonFooter } from '@ionic/angular';

import { AuthService } from '../../core/services/auth.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { AppBrandHeaderComponent } from '../../shared/ui/app-brand-header/app-brand-header.component';
import { AppTabBarComponent } from '../../shared/ui/app-tab-bar/app-tab-bar.component';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['../shop.scss', './wallet.page.scss'],
  imports: [IonContent, IonFooter, RouterLink, DatePipe, AppTabBarComponent, AppBrandHeaderComponent],
})
export class WalletPage {
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);
  readonly checkout = inject(CheckoutService);

  back(): void {
    void this.router.navigateByUrl('/home');
  }
}
