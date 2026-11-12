import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { IonContent } from '@ionic/angular';

import { AppPageHeaderComponent } from '../../shared/ui/app-page-header/app-page-header.component';

const FAQS = [
  {
    q: 'How do I send a gift card?',
    a: 'Open Gift Cards, pick a merchant and amount, add it to your cart, then enter the recipient details at checkout.',
  },
  {
    q: 'Where can I find the gift cards I bought?',
    a: 'Open My Gift from the bottom bar. Every purchased card and its reference number is listed there.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Gift cards are delivered to the recipient by SMS or email right after your payment is confirmed.',
  },
  {
    q: 'I forgot my PIN. What should I do?',
    a: 'On the login screen enter your mobile number and tap Send PIN. A new 6-digit PIN is generated each time.',
  },
  {
    q: 'Can I get a refund?',
    a: 'Gift cards are non-refundable once delivered. Contact support within 24 hours if something went wrong.',
  },
];

@Component({
  selector: 'app-help',
  imports: [IonContent, AppPageHeaderComponent],
  styleUrls: ['../account.scss'],
  template: `
    <app-page-header title="Help & Support" (back)="location.back()"></app-page-header>
    <ion-content [fullscreen]="true">
      <div class="wrap">
        <div class="contact">
          <a href="mailto:support@kauwai.com"><i class="ri-mail-line"></i>Email us</a>
          <a href="tel:+6797000000"><i class="ri-phone-line"></i>Call us</a>
        </div>

        <h2>Frequently asked questions</h2>
        <ul class="rows">
          @for (f of faqs; track f.q; let i = $index) {
            <li>
              <button type="button" class="row" [attr.aria-expanded]="open() === i" (click)="toggle(i)">
                <span class="grow">{{ f.q }}</span>
                <i class="chev" [class]="open() === i ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"></i>
              </button>
              @if (open() === i) {
                <p class="ans">{{ f.a }}</p>
              }
            </li>
          }
        </ul>
      </div>
    </ion-content>
  `,
  styles: `
    h2 {
      margin: 20px 0 4px;
      font-size: 15px;
      color: var(--ion-color-primary);
    }
    .contact {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .contact a {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 16px;
      border-radius: 16px;
      background: #eef5fc;
      color: var(--ion-color-primary);
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
    }
    .contact i {
      font-size: 24px;
    }
    .ans {
      margin: 0 0 14px;
      padding: 0 4px;
      font-size: 13px;
      line-height: 1.5;
      color: #33475b;
    }
  `,
})
export class HelpPage {
  readonly location = inject(Location);
  readonly faqs = FAQS;
  readonly open = signal(-1);

  toggle(i: number): void {
    this.open.set(this.open() === i ? -1 : i);
  }
}
