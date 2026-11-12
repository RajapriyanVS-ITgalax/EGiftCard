import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DATA_URL } from '../core/services/data.service';

import { HomePage } from './home.page';

describe('HomePage', () => {
  it('groups gift cards by category and filters the rows by category and search', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])] });
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();

    TestBed.inject(HttpTestingController)
      .expectOne(DATA_URL)
      .flush({
        app: { name: 'Test', tagline: '', splashDurationMs: 0 },
        categories: [
          { name: 'All', icon: 'ri-gift-line', color: '#000' },
          { name: 'Food', icon: 'ri-restaurant-line', color: '#000' },
        ],
        promotions: [],
        giftCards: [
          { id: 'a', name: 'Apple', initials: 'A', category: 'Food', minAmount: 1, maxAmount: 2, color: '#000' },
          { id: 'b', name: 'Book', initials: 'B', category: 'Other', minAmount: 1, maxAmount: 2, color: '#000' },
          { id: 'c', name: 'Cafe', initials: 'C', category: 'Food', minAmount: 1, maxAmount: 2, color: '#000' },
        ],
      });
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const sections = el.querySelectorAll('.featured');
    expect(sections.length).toBe(2);
    expect(sections[0].querySelector('h3')?.textContent).toContain('Food');
    expect(sections[0].querySelectorAll('.card').length).toBe(2);
    expect(sections[1].querySelector('h3')?.textContent).toContain('Other');
    expect(sections[1].querySelectorAll('.card').length).toBe(1);
    expect(sections[0].querySelector('a.link')?.getAttribute('href')).toBe('/gift-cards?category=Food');
    expect(sections[1].querySelector('a.link')?.getAttribute('href')).toBe('/gift-cards?category=Other');
    expect(el.querySelector('.empty')).toBeNull();

    fixture.componentInstance.selectedCategory.set('Food');
    fixture.detectChanges();
    expect(el.querySelectorAll('.featured').length).toBe(1);
    expect(el.querySelectorAll('.card').length).toBe(2);

    fixture.componentInstance.searchControl.setValue('cafe');
    fixture.detectChanges();
    expect(el.querySelectorAll('.card').length).toBe(1);
    expect(el.querySelector('.name')?.textContent).toContain('Cafe');

    fixture.componentInstance.searchControl.setValue('missing');
    fixture.detectChanges();
    expect(el.querySelectorAll('.featured').length).toBe(0);
    expect(el.querySelector('.empty')?.textContent).toContain('No gift cards found.');
  });
});
