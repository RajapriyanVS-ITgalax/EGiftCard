import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { DATA_URL } from '../../core/services/data.service';

import { GiftCardsPage } from './gift-cards.page';

describe('GiftCardsPage', () => {
  it('selects the category from the URL and responds to subsequent navigation', () => {
    const queryParamMap = new BehaviorSubject(convertToParamMap({ category: 'Food & Dining' }));
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { queryParamMap: queryParamMap.asObservable() } },
      ],
    });
    const fixture = TestBed.createComponent(GiftCardsPage);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController)
      .expectOne(DATA_URL)
      .flush({
        app: { name: 'Test', tagline: '', splashDurationMs: 0 },
        categories: [
          { name: 'All', icon: '', color: '#000' },
          { name: 'Food & Dining', icon: '', color: '#000' },
          { name: 'Shopping', icon: '', color: '#000' },
        ],
        promotions: [],
        giftCards: [
          { id: 'a', name: 'Cafe', initials: 'C', category: 'Food & Dining', minAmount: 1, maxAmount: 2, color: '#000' },
          { id: 'b', name: 'Shop', initials: 'S', category: 'Shopping', minAmount: 1, maxAmount: 2, color: '#000' },
        ],
      });
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.tab.active')?.textContent).toContain('Food & Dining');
    expect(el.querySelectorAll('.item').length).toBe(1);
    expect(el.querySelector('.item')?.textContent).toContain('Cafe');

    queryParamMap.next(convertToParamMap({ category: 'Shopping' }));
    fixture.detectChanges();
    expect(el.querySelector('.tab.active')?.textContent).toContain('Shopping');
    expect(el.querySelector('.item')?.textContent).toContain('Shop');

    queryParamMap.next(convertToParamMap({}));
    fixture.detectChanges();
    expect(el.querySelector('.tab.active')?.textContent).toContain('All');
    expect(el.querySelectorAll('.item').length).toBe(2);
  });
});
