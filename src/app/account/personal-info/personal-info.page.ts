import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, ToastController } from '@ionic/angular';

import { ProfileService } from '../../core/services/profile.service';
import { AppPageHeaderComponent } from '../../shared/ui/app-page-header/app-page-header.component';

@Component({
  selector: 'app-personal-info',
  imports: [IonContent, ReactiveFormsModule, AppPageHeaderComponent],
  styleUrls: ['../account.scss'],
  template: `
    <app-page-header title="Personal Information" (back)="location.back()"></app-page-header>
    <ion-content [fullscreen]="true">
      <form class="wrap" [formGroup]="form" (ngSubmit)="save()" novalidate>
        <div class="who">
          <span class="avatar big">{{ profile.initials() }}</span>
        </div>
        <label class="field">
          <span>Full name</span>
          <input formControlName="name" autocomplete="name" />
          @if (form.controls.name.touched && form.controls.name.invalid) {
            <small>Enter your full name</small>
          }
        </label>
        <label class="field">
          <span>Date of birth</span>
          <input type="date" formControlName="dob" />
        </label>
        <label class="field">
          <span>Email</span>
          <input type="email" formControlName="email" autocomplete="email" placeholder="name@example.com" />
          @if (form.controls.email.invalid) {
            <small>Enter a valid email address</small>
          }
        </label>
        <button type="submit" class="btn">Save changes</button>
      </form>
    </ion-content>
  `,
  styles: `
    .who {
      display: flex;
      justify-content: center;
      margin: 8px 0 20px;
    }
    .big {
      width: 84px;
      height: 84px;
      font-size: 30px;
    }
  `,
})
export class PersonalInfoPage {
  readonly location = inject(Location);
  readonly profile = inject(ProfileService);
  private readonly toast = inject(ToastController);

  readonly form = inject(FormBuilder).nonNullable.group({
    name: [this.profile.profile().name, [Validators.required, Validators.pattern(/\S/)]],
    dob: [this.profile.profile().dob],
    email: [this.profile.profile().email, Validators.email],
  });

  async save(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const { name, dob, email } = this.form.getRawValue();
    this.profile.update({ name: name.trim(), dob, email: email.trim() });
    const t = await this.toast.create({ message: 'Profile updated', duration: 1800, position: 'bottom' });
    await t.present();
    this.location.back();
  }
}
