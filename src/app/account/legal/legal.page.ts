import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';

import { AppPageHeaderComponent } from '../../shared/ui/app-page-header/app-page-header.component';

interface Section {
  h: string;
  p: string;
}

const DOCS: Record<'terms' | 'privacy', { title: string; sections: Section[] }> = {
  terms: {
    title: 'Terms & Conditions',
    sections: [
      { h: '1. Using Kauwai EGift', p: 'You must be 18 or older, or have a guardian’s permission, to purchase gift cards.' },
      { h: '2. Gift cards', p: 'Gift cards are delivered electronically, are redeemable only at the named merchant, and are non-refundable once delivered. Merchants set their own expiry and redemption rules.' },
      { h: '3. Payments', p: 'All prices are shown in Fijian dollars. Your order is confirmed only after payment succeeds.' },
      { h: '4. Your account', p: 'Keep your PIN private. You are responsible for activity on your account.' },
      { h: '5. Changes', p: 'We may update these terms from time to time. Continued use of the app means you accept the updated terms.' },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    sections: [
      { h: 'Information we collect', p: 'Your mobile number, name, optional email and address, and details of gift cards you buy or send.' },
      { h: 'How we use it', p: 'To deliver gift cards, verify your identity, provide support and improve the app.' },
      { h: 'Sharing', p: 'We share only what is needed with merchants and payment providers to complete your purchase. We never sell your data.' },
      { h: 'Biometrics', p: 'Biometric login is handled by your device. Kauwai never receives or stores your fingerprint or face data.' },
      { h: 'Your choices', p: 'You can update or request deletion of your information by contacting support.' },
    ],
  },
};

@Component({
  selector: 'app-legal',
  imports: [IonContent, AppPageHeaderComponent],
  styleUrls: ['../account.scss'],
  template: `
    <app-page-header [title]="doc.title" (back)="location.back()"></app-page-header>
    <ion-content [fullscreen]="true">
      <div class="wrap doc">
        @for (s of doc.sections; track s.h) {
          <h2>{{ s.h }}</h2>
          <p>{{ s.p }}</p>
        }
      </div>
    </ion-content>
  `,
})
export class LegalPage {
  readonly location = inject(Location);
  readonly doc = DOCS[inject(ActivatedRoute).snapshot.data['doc'] as 'terms' | 'privacy'];
}
