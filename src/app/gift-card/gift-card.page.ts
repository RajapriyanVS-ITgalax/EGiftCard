import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular';

import type { VoucherPackage } from '../core/models/app-data.model';
import { CartService } from '../core/services/cart.service';
import { DataService } from '../core/services/data.service';
import { AppBrandHeaderComponent } from '../shared/ui/app-brand-header/app-brand-header.component';

@Component({
  selector: 'app-gift-card',
  templateUrl: './gift-card.page.html',
  styleUrls: ['./gift-card.page.scss'],
  imports: [CurrencyPipe, IonContent, AppBrandHeaderComponent],
})
export class GiftCardPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastController);
  private readonly data = toSignal(inject(DataService).data$);
  readonly cart = inject(CartService);

  private readonly id = this.route.snapshot.paramMap.get('id');
  readonly card = computed(() => this.data()?.giftCards.find((c) => c.id === this.id));
  readonly packages = computed<VoucherPackage[]>(() => {
    const card = this.card();
    if (!card) {
      return [];
    }
    if (card.packages?.length) {
      return card.packages;
    }
    const amounts = card.amounts?.length ? card.amounts : [card.minAmount, card.maxAmount];
    return amounts.map((amount) => ({ id: '', name: 'Gift Card Voucher', amount }));
  });

  readonly selectedPackageIndex = signal(0);
  readonly quantity = signal(1);
  readonly favourite = signal(false);
  readonly selectedPackage = computed(() => this.packages()[this.selectedPackageIndex()]);
  readonly amount = computed(() => this.selectedPackage()?.amount ?? 0);

  back(): void {
    void this.router.navigateByUrl('/home');
  }

  openCart(): void {
    void this.router.navigateByUrl('/cart');
  }

  changeQuantity(delta: number): void {
    this.quantity.update((q) => Math.min(10, Math.max(1, q + delta)));
  }

  async addToCart(): Promise<void> {
    const card = this.card();
    const selectedPackage = this.selectedPackage();
    if (!card || !selectedPackage) {
      return;
    }
    this.cart.add({
      cardId: card.id,
      name: card.name,
      amount: this.amount(),
      quantity: this.quantity(),
      image: card.image,
      ...(selectedPackage.id
        ? { packageId: selectedPackage.id, packageName: selectedPackage.name }
        : {}),
    });
    const t = await this.toast.create({
      message: `${card.name} added to cart`,
      duration: 1500,
      position: 'bottom',
    });
    await t.present();
    void this.router.navigateByUrl('/cart');
  }
}
