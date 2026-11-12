import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-tab-bar',
  template: `
    @if (auth.isLoggedIn()) {
      <nav class="tabs" aria-label="Main">
        <a routerLink="/home" routerLinkActive="active"><i class="ri-home-5-line"></i>Home</a>
        <a routerLink="/gift-cards" routerLinkActive="active"><i class="ri-gift-line"></i>Gift Cards</a>
        <a routerLink="/cart" routerLinkActive="active">
          <i class="ri-shopping-cart-2-line"></i>Cart
          @if (cart.count() > 0) {
            <b>{{ cart.count() }}</b>
          }
        </a>
        <a routerLink="/wallet" routerLinkActive="active"><i class="ri-wallet-3-line"></i>My Gift</a>
      </nav>
    }
  `,
  styles: `
    .tabs {
      display: flex;
      justify-content: space-around;
      padding: 8px 0 calc(var(--ion-safe-area-bottom, 0px) + 8px);
      border-top: 1px solid #e3e8ee;
      background: #fff;
      font-family: 'Poppins', sans-serif;
    }
    a {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      color: var(--ion-color-medium);
      font-size: 11px;
      text-decoration: none;
    }
    a i {
      font-size: 22px;
    }
    a.active {
      color: var(--ion-color-primary);
      font-weight: 600;
    }
    b {
      position: absolute;
      top: -4px;
      right: -2px;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      border-radius: 8px;
      background: var(--ion-color-accent);
      color: #fff;
      font-size: 10px;
      line-height: 16px;
      text-align: center;
    }
  `,
  imports: [RouterLink, RouterLinkActive],
})
export class AppTabBarComponent {
  readonly cart = inject(CartService);
  readonly auth = inject(AuthService);
}
