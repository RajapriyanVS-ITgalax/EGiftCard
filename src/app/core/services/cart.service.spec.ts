import { TestBed } from '@angular/core/testing';

import { CartService } from './cart.service';
import { StorageService } from './storage.service';

describe('CartService', () => {
  it('keeps different packages at the same price separate while merging identical packages', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useValue: { get: () => null, set: () => {} } }],
    });
    const cart = TestBed.inject(CartService);
    const item = { cardId: 'cafe', name: 'Cafe', amount: 50, quantity: 1, packageId: 'lunch', packageName: 'Lunch' };
    cart.add(item);
    cart.add(item);
    cart.add({ ...item, packageId: 'dinner', packageName: 'Dinner' });

    expect(cart.items().length).toBe(2);
    expect(cart.items()[0].quantity).toBe(2);
    expect(cart.items()[1].packageName).toBe('Dinner');
    expect(cart.total()).toBe(150);
  });
});
