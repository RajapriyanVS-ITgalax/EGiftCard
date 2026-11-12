import { Component, computed, DestroyRef, inject, signal, viewChild } from '@angular/core';
import type { ElementRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, IonFooter } from '@ionic/angular';

import type { GiftCard } from '../core/models/app-data.model';
import { DataService } from '../core/services/data.service';
import { AppBrandHeaderComponent } from '../shared/ui/app-brand-header/app-brand-header.component';
import { AppInputComponent } from '../shared/ui/app-input/app-input.component';
import { AppTabBarComponent } from '../shared/ui/app-tab-bar/app-tab-bar.component';

const PROMO_INTERVAL_MS = 5000;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonContent,
    IonFooter,
    RouterLink,
    ReactiveFormsModule,
    AppBrandHeaderComponent,
    AppInputComponent,
    AppTabBarComponent,
  ],
})
export class HomePage {
  private readonly data = toSignal(inject(DataService).data$);

  readonly appName = computed(() => this.data()?.app.name ?? '');
  readonly categories = computed(() => this.data()?.categories ?? []);
  readonly selectedCategory = signal('All');
  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly search = toSignal(this.searchControl.valueChanges, { initialValue: '' });

  readonly promotions = computed(() => {
    const data = this.data();
    return (data?.promotions ?? []).map((p) => ({
      ...p,
      card: data?.giftCards.find((c) => c.id === p.giftCardId),
    }));
  });

  private readonly promoTrack = viewChild<ElementRef<HTMLElement>>('promoTrack');
  readonly activePromo = signal(0);
  paused = false;

  constructor() {
    const timer = setInterval(() => {
      const count = this.promotions().length;
      if (!this.paused && count > 1) {
        this.goToPromo((this.activePromo() + 1) % count);
      }
    }, PROMO_INTERVAL_MS);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  goToPromo(index: number): void {
    const track = this.promoTrack()?.nativeElement;
    const slide = track?.children[index] as HTMLElement | undefined;
    if (track && slide) {
      track.scrollTo?.({ left: index * (slide.offsetWidth + 12), behavior: 'smooth' });
    }
    this.activePromo.set(index);
  }

  onPromoScroll(): void {
    const track = this.promoTrack()?.nativeElement;
    const slide = track?.children[0] as HTMLElement | undefined;
    if (track && slide) {
      const index = Math.round(track.scrollLeft / (slide.offsetWidth + 12));
      this.activePromo.set(Math.min(index, this.promotions().length - 1));
    }
  }

  readonly giftCards = computed<GiftCard[]>(() => {
    const term = this.search().trim().toLowerCase();
    const category = this.selectedCategory();
    return (this.data()?.giftCards ?? []).filter(
      (c) => (category === 'All' || c.category === category) && c.name.toLowerCase().includes(term),
    );
  });

  readonly cardGroups = computed(() => {
    const groups = new Map<string, GiftCard[]>();
    for (const card of this.giftCards()) {
      const cards = groups.get(card.category);
      if (cards) {
        cards.push(card);
      } else {
        groups.set(card.category, [card]);
      }
    }
    return Array.from(groups, ([category, cards]) => ({ category, cards }));
  });
}
