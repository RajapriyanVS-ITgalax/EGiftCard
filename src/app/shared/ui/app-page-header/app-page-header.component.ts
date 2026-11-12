import { Component, input, output } from '@angular/core';
import { IonHeader, IonToolbar } from '@ionic/angular';

/** Sub-screen header: back arrow, centered title and an optional right-hand slot. */
@Component({
  selector: 'app-page-header',
  imports: [IonHeader, IonToolbar],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <div class="bar">
          <button type="button" class="back" aria-label="Back" (click)="back.emit()">
            <i class="ri-arrow-left-s-line"></i>
          </button>
          <h1>{{ title() }}</h1>
          <span class="end"><ng-content></ng-content></span>
        </div>
      </ion-toolbar>
    </ion-header>
  `,
  styles: `
    .bar {
      display: grid;
      grid-template-columns: minmax(40px, 1fr) auto minmax(40px, 1fr);
      align-items: center;
      padding: 0 12px;
      font-family: 'Poppins', sans-serif;
    }
    h1 {
      margin: 0;
      text-align: center;
      font-size: 18px;
      font-weight: 600;
      color: var(--ion-color-primary);
    }
    .back {
      border: 0;
      background: none;
      padding: 0;
      font-size: 28px;
      line-height: 1;
      text-align: left;
      color: var(--ion-color-primary);
    }
    .end {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      color: var(--ion-color-primary);
      font-size: 22px;
    }
  `,
})
export class AppPageHeaderComponent {
  readonly title = input.required<string>();
  readonly back = output<void>();
}
