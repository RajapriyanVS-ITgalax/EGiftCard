import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonContent, IonFooter, IonMenu } from '@ionic/angular';

import { DataService } from '../../core/services/data.service';
import { AppBrandHeaderComponent } from '../../shared/ui/app-brand-header/app-brand-header.component';
import { AppTabBarComponent } from '../../shared/ui/app-tab-bar/app-tab-bar.component';

@Component({
  selector: 'app-gift-cards',
  templateUrl: './gift-cards.page.html',
  styleUrls: ['../shop.scss', './gift-cards.page.scss'],
  imports: [IonContent, IonFooter, RouterLink, AppTabBarComponent, AppBrandHeaderComponent, IonMenu],
})
export class GiftCardsPage {
  private readonly router = inject(Router);
  private readonly data = toSignal(inject(DataService).data$);

  readonly categories = computed(() => this.data()?.categories ?? []);
  readonly selected = signal('All');
  readonly cards = computed(() => {
    const category = this.selected();
    return (this.data()?.giftCards ?? []).filter((c) => category === 'All' || c.category === category);
  });

  constructor() {
    inject(ActivatedRoute).queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.selected.set(params.get('category') || 'All');
    });
  }

  back(): void {
    void this.router.navigateByUrl('/home');
  }
}
