import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, ToastController } from '@ionic/angular';

import { ProfileService } from '../../core/services/profile.service';
import { AppPageHeaderComponent } from '../../shared/ui/app-page-header/app-page-header.component';

@Component({
  selector: 'app-contact-details',
  imports: [IonContent, ReactiveFormsModule, AppPageHeaderComponent],
  styleUrls: ['../account.scss'],
  template: `
    <app-page-header title="Contact Details" (back)="location.back()"></app-page-header>
    <ion-content [fullscreen]="true">
      <form class="wrap" [formGroup]="form" (ngSubmit)="save()" novalidate>
        <label class="field">
          <span>Mobile number (login)</span>
          <input [value]="profile.phone()" readonly />
        </label>
        <label class="field">
          <span>Alternative mobile</span>
          <input formControlName="altMobile" inputmode="numeric" placeholder="Optional" />
          @if (form.controls.altMobile.invalid) {
            <small>Enter a valid mobile number (7-10 digits)</small>
          }
        </label>
        <label class="field">
          <span>Email</span>
          <input type="email" formControlName="email" placeholder="name@example.com" />
          @if (form.controls.email.invalid) {
            <small>Enter a valid email address</small>
          }
        </label>
        <label class="field">
          <span>Address</span>
          <textarea rows="3" formControlName="address" placeholder="Street, city"></textarea>
        </label>
        <button type="submit" class="btn">Save changes</button>
      </form>
    </ion-content>
  `,
})
export class ContactDetailsPage {
  readonly location = inject(Location);
  readonly profile = inject(ProfileService);
  private readonly toast = inject(ToastController);

  readonly form = inject(FormBuilder).nonNullable.group({
    altMobile: [this.profile.profile().altMobile, Validators.pattern(/^(\d{7,10})?$/)],
    email: [this.profile.profile().email, Validators.email],
    address: [this.profile.profile().address],
  });

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.profile.update(this.form.getRawValue());
    const t = await this.toast.create({ message: 'Contact details updated', duration: 1800, position: 'bottom' });
    await t.present();
    this.location.back();
  }
}
