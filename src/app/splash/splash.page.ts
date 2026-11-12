import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

import { DataService } from '../core/services/data.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  imports: [IonContent],
})
export class SplashPage implements OnInit {
  private readonly router = inject(Router);
  private readonly dataService = inject(DataService);

  async ngOnInit(): Promise<void> {
    const started = Date.now();
    let duration = 2500;
    try {
      duration = (await firstValueFrom(this.dataService.data$)).app.splashDurationMs;
    } catch {
      // fall back to the default duration
    }
    const remaining = Math.max(0, duration - (Date.now() - started));
    setTimeout(() => void this.router.navigateByUrl('/welcome', { replaceUrl: true }), remaining);
  }
}
