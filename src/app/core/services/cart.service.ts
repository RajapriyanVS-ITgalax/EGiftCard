import { Injectable, computed, inject, signal } from '@angular/core';

import { StorageService } from './storage.service';

export interface CartItem {
  cardId: string;
  name: string;
  amount: number;
  quantity: number;
  image?: string;
  packageId?: string;
  packageName?: string;
}

const CART_KEY = 'cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storage = inject(StorageService);
  private readonly _items = signal<CartItem[]>(this.storage.get<CartItem[]>(CART_KEY) ?? []);

  readonly items = this._items.asReadonly();
  readonly count = computed(() => this._items().reduce((sum, i) => sum + i.quantity, 0));
  readonly total = computed(() => this._items().reduce((sum, i) => sum + i.amount * i.quantity, 0));

  add(item: CartItem): void {
    const items = [...this._items()];
    const existing = items.find(
      (i) => i.cardId === item.cardId && i.amount === item.amount && i.packageId === item.packageId,
    );
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      items.push({ ...item });
    }
    this.set(items);
  }

  clear(): void {
    this.set([]);
  }

  changeQuantity(index: number, delta: number): void {
    const items = this._items().map((i, n) =>
      n === index ? { ...i, quantity: Math.min(10, Math.max(1, i.quantity + delta)) } : i,
    );
    this.set(items);
  }

  remove(index: number): void {
    this.set(this._items().filter((_, n) => n !== index));
  }

  private set(items: CartItem[]): void {
    this._items.set(items);
    this.storage.set(CART_KEY, items);
  }
}
