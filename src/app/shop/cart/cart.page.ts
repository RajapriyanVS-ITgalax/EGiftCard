import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonFooter } from '@ionic/angular';

import { CartService } from '../../core/services/cart.service';
import { AppBrandHeaderComponent } from '../../shared/ui/app-brand-header/app-brand-header.component';
import { AppTabBarComponent } from '../../shared/ui/app-tab-bar/app-tab-bar.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['../shop.scss', './cart.page.scss'],
  imports: [IonContent, IonFooter, RouterLink, AppTabBarComponent, AppBrandHeaderComponent],
})
export class CartPage {
  private readonly router = inject(Router);
  readonly cart = inject(CartService);

  back(): void {
    void this.router.navigateByUrl('/home');
  }

  checkout(): void {
    void this.router.navigateByUrl('/checkout');
  }
}
