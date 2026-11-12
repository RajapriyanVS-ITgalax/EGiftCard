import { DatePipe, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonContent } from '@ionic/angular';

import { ProfileService } from '../../core/services/profile.service';
import { AppPageHeaderComponent } from '../../shared/ui/app-page-header/app-page-header.component';

@Component({
  selector: 'app-notifications',
  imports: [IonContent, DatePipe, AppPageHeaderComponent],
  styleUrls: ['../account.scss'],
  template: `
    <app-page-header title="Notifications" (back)="location.back()">
      @if (profile.unreadCount() > 0) {
        <button type="button" class="mark" aria-label="Mark all as read" (click)="profile.markAllRead()">
          <i class="ri-check-double-line"></i>
        </button>
      }
    </app-page-header>
    <ion-content [fullscreen]="true">
      <div class="wrap">
        @if (profile.notifications().length === 0) {
          <div class="empty"><i class="ri-notification-off-line"></i>No notifications yet.</div>
        } @else {
          <ul class="rows">
            @for (n of profile.notifications(); track n.id) {
              <li>
                <button type="button" class="row item" [class.unread]="!n.read" (click)="profile.markRead(n.id)">
                  <span class="avatar ico"><i [class]="n.icon"></i></span>
                  <span class="grow">
                    <b>{{ n.title }}</b>
                    <small>{{ n.body }}</small>
                    <em>{{ n.date | date: 'medium' }}</em>
                  </span>
                  @if (!n.read) {
                    <span class="dot"></span>
                  }
                </button>
              </li>
            }
          </ul>
        }
      </div>
    </ion-content>
  `,
  styles: `
    .mark {
      border: 0;
      background: none;
      color: var(--ion-color-primary);
      font-size: 22px;
      padding: 0;
    }
    .item {
      align-items: flex-start;
    }
    .ico {
      width: 40px;
      height: 40px;
      font-size: 20px;
    }
    .grow {
      display: grid;
      gap: 2px;
    }
    .grow b {
      font-size: 14px;
    }
    .grow small {
      font-size: 12px;
      color: #33475b;
    }
    .grow em {
      font-size: 10px;
      font-style: normal;
      color: var(--ion-color-medium);
    }
    .unread {
      background: #f2f8fd;
    }
    .dot {
      width: 9px;
      height: 9px;
      margin-top: 6px;
      border-radius: 50%;
      background: var(--ion-color-accent);
    }
  `,
})
export class NotificationsPage {
  readonly profile = inject(ProfileService);
  readonly location = inject(Location);
}
