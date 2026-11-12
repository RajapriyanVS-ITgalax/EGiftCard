import { Injectable, computed, inject, signal } from '@angular/core';

import { CartService } from './cart.service';
import type { CartItem } from './cart.service';
import { StorageService } from './storage.service';

export type PaymentMethod = 'mPaisa' | 'M-Cash' | 'Visa / Mastercard';
export type RecipientMode = 'me' | 'other';

export interface Recipient {
  mode: RecipientMode;
  name: string;
  mobile: string;
  message: string;
}

export interface Order {
  reference: string;
  items: CartItem[];
  total: number;
  recipient: Recipient;
  payment: PaymentMethod;
  buyer: string | null;
  createdAt: string;
}

const ORDERS_KEY = 'orders';

/** Holds the in-progress checkout (recipient + payment) and the placed orders (mock backend). */
@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly cart = inject(CartService);
  private readonly storage = inject(StorageService);

  readonly recipient = signal<Recipient>({ mode: 'me', name: '', mobile: '', message: 'Enjoy your gift!' });
  readonly payment = signal<PaymentMethod>('mPaisa');
  readonly orders = signal<Order[]>(this.storage.get<Order[]>(ORDERS_KEY) ?? []);
  readonly lastOrder = signal<Order | null>(null);

  /** Gifts that belong to the wallet: the ones bought for yourself. */
  readonly walletItems = computed(() =>
    this.orders()
      .filter((o) => o.recipient.mode === 'me')
      .flatMap((o) => o.items.map((i) => ({ ...i, reference: o.reference, date: o.createdAt }))),
  );
  readonly walletBalance = computed(() => this.walletItems().reduce((sum, i) => sum + i.amount * i.quantity, 0));

  place(buyer: string | null): Order {
    const order: Order = {
      reference: `#KG${Math.floor(100000 + Math.random() * 900000)}`,
      items: this.cart.items().map((i) => ({ ...i })),
      total: this.cart.total(),
      recipient: { ...this.recipient() },
      payment: this.payment(),
      buyer,
      createdAt: new Date().toISOString(),
    };
    const orders = [order, ...this.orders()];
    this.orders.set(orders);
    this.storage.set(ORDERS_KEY, orders);
    this.lastOrder.set(order);
    this.cart.clear();
    return order;
  }
}
