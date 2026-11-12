import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular';

import { ProfileService } from '../../core/services/profile.service';
import { AppPageHeaderComponent } from '../../shared/ui/app-page-header/app-page-header.component';

@Component({
  selector: 'app-contacts',
  imports: [IonContent, FormsModule, AppPageHeaderComponent],
  styleUrls: ['../account.scss'],
  template: `
    <app-page-header title="Contacts" (back)="location.back()">
      <button type="button" class="add" aria-label="Add contact" (click)="adding.set(!adding())">
        <i [class]="adding() ? 'ri-close-line' : 'ri-user-add-line'"></i>
      </button>
    </app-page-header>
    <ion-content [fullscreen]="true">
      <div class="wrap">
        @if (adding()) {
          <form class="form" (ngSubmit)="save()" #f="ngForm" novalidate>
            <label class="field">
              <span>Name</span>
              <input name="name" [(ngModel)]="name" required placeholder="Contact name" />
            </label>
            <label class="field">
              <span>Mobile number</span>
              <input name="mobile" [(ngModel)]="mobile" required inputmode="numeric" placeholder="7-10 digits" />
              @if (error()) {
                <small>{{ error() }}</small>
              }
            </label>
            <button type="submit" class="btn">Save contact</button>
          </form>
        }

        @if (profile.contacts().length === 0 && !adding()) {
          <div class="empty">
            <i class="ri-contacts-book-line"></i>
            No contacts yet.<br />Save people you often send gifts to.
          </div>
          <button type="button" class="btn" (click)="adding.set(true)">Add a contact</button>
        } @else {
          <ul class="rows">
            @for (c of profile.contacts(); track c.id) {
              <li>
                <div class="row">
                  <span class="avatar ico">{{ c.name[0].toUpperCase() }}</span>
                  <span class="grow">
                    <b>{{ c.name }}</b><br /><small>+679 {{ c.mobile }}</small>
                  </span>
                  <button type="button" class="del" aria-label="Delete contact" (click)="profile.removeContact(c.id)">
                    <i class="ri-delete-bin-6-line"></i>
                  </button>
                </div>
              </li>
            }
          </ul>
        }
      </div>
    </ion-content>
  `,
  styles: `
    .add {
      border: 0;
      background: none;
      padding: 0;
      color: var(--ion-color-primary);
      font-size: 22px;
    }
    .form {
      margin-bottom: 20px;
    }
    .ico {
      width: 40px;
      height: 40px;
    }
    .grow small {
      color: var(--ion-color-medium);
    }
    .del {
      border: 0;
      background: none;
      color: var(--ion-color-danger);
      font-size: 20px;
    }
  `,
})
export class ContactsPage {
  readonly profile = inject(ProfileService);
  readonly location = inject(Location);

  readonly adding = signal(false);
  readonly error = signal('');
  name = '';
  mobile = '';

  save(): void {
    const name = this.name.trim();
    const mobile = this.mobile.trim();
    if (!name || !/^\d{7,10}$/.test(mobile)) {
      this.error.set('Enter a name and a valid mobile number (7-10 digits)');
      return;
    }
    this.profile.addContact(name, mobile);
    this.name = '';
    this.mobile = '';
    this.error.set('');
    this.adding.set(false);
  }
}
