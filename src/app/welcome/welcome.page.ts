import type { OnInit } from '@angular/core';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';

import { DataService } from '../core/services/data.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  imports: [IonContent, RouterLink],
})
export class WelcomePage implements OnInit {
  private readonly dataService = inject(DataService);
  readonly tagline = signal('The Perfect Gift for Every Occasion');

  ngOnInit(): void {
    this.dataService.data$.subscribe({ next: (d) => this.tagline.set(d.app.tagline) });
  }
}
