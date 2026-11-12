import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { vi } from 'vitest';

import { CartService } from '../core/services/cart.service';
import { DATA_URL } from '../core/services/data.service';

import { GiftCardPage } from './gift-card.page';

describe('GiftCardPage', () => {
  it('selects a voucher amount and adds the chosen quantity to the cart', async () => {
    const add = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: 'cafe' }) } } },
        { provide: CartService, useValue: { count: signal(0), add } },
        { provide: ToastController, useValue: { create: async () => ({ present: async () => {} }) } },
      ],
    });
    const fixture = TestBed.createComponent(GiftCardPage);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController)
      .expectOne(DATA_URL)
      .flush({
        app: { name: 'Test', tagline: '', splashDurationMs: 0 },
        categories: [],
        promotions: [],
        giftCards: [
          {
            id: 'cafe', name: 'Cafe', initials: 'C', category: 'Food', minAmount: 25, maxAmount: 100,
            amounts: [25, 50, 100], color: '#000',
            packages: [
              { id: 'lunch', name: 'Lunch', amount: 25, description: 'Lunch for one', validity: 'Valid for 3 months' },
              { id: 'dinner', name: 'Dinner', amount: 50, badge: 'Popular' },
              { id: 'tasting', name: 'Tasting', amount: 100 },
            ],
          },
        ],
      });
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const options = el.querySelectorAll<HTMLInputElement>('input[name="voucher-amount"]');
    expect(options.length).toBe(3);
    expect(options[0].checked).toBe(true);
    expect(el.querySelector('.package')?.textContent).toContain('Lunch for one');
    expect(el.querySelector('.package')?.textContent).toContain('Valid for 3 months');
    expect(el.querySelector('.add')?.textContent).toContain('$25.00');

    options[1].click();
    el.querySelector<HTMLButtonElement>('[aria-label="Increase quantity"]')?.click();
    fixture.detectChanges();
    expect(options[1].checked).toBe(true);
    expect(el.querySelector('.add')?.textContent).toContain('$100.00');

    vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    await fixture.componentInstance.addToCart();
    expect(add).toHaveBeenCalledWith({
      cardId: 'cafe', name: 'Cafe', amount: 50, quantity: 2, image: undefined,
      packageId: 'dinner', packageName: 'Dinner',
    });
  });

  it('uses the existing amount options when no packages are defined', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: 'shop' }) } } },
      ],
    });
    const fixture = TestBed.createComponent(GiftCardPage);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController)
      .expectOne(DATA_URL)
      .flush({
        app: { name: 'Test', tagline: '', splashDurationMs: 0 },
        categories: [], promotions: [],
        giftCards: [
          { id: 'shop', name: 'Shop', initials: 'S', category: 'Shopping', minAmount: 20, maxAmount: 100,
            amounts: [20, 50, 100], color: '#000' },
        ],
      });
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('.package').length).toBe(3);
    expect(el.querySelector('.package')?.textContent).toContain('$20.00');
    expect(el.querySelector('.add')?.textContent).toContain('$20.00');
  });
});
