import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-complete-purchase',
  templateUrl: './complete-purchase.page.html',
  styleUrls: ['../shop.scss', './complete-purchase.page.scss'],
  imports: [IonContent, RouterLink],
})
export class CompletePurchasePage {
  private readonly router = inject(Router);

  back(): void {
    void this.router.navigateByUrl('/review');
  }
}
