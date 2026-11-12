import { Injectable, computed, inject, signal } from '@angular/core';

import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

export interface UserProfile {
  name: string;
  email: string;
  dob: string;
  address: string;
  altMobile: string;
}

export interface Contact {
  id: string;
  name: string;
  mobile: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  icon: string;
  date: string;
  read: boolean;
}

const PROFILE_KEY = 'user_profile';
const CONTACTS_KEY = 'user_contacts';
const NOTIFS_KEY = 'user_notifications';
const PUSH_KEY = 'pref_push';

const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Welcome to Kauwai EGift',
    body: 'Send a gift card to someone special in just a few taps.',
    icon: 'ri-gift-line',
    date: new Date().toISOString(),
    read: false,
  },
  {
    id: 'n2',
    title: 'New gift cards available',
    body: 'Fresh merchants have been added. Tap Gift Cards to explore.',
    icon: 'ri-store-2-line',
    date: new Date(Date.now() - 86_400_000).toISOString(),
    read: false,
  },
  {
    id: 'n3',
    title: 'Secure your account',
    body: 'Turn on biometric login for faster and safer sign in.',
    icon: 'ri-shield-check-line',
    date: new Date(Date.now() - 3 * 86_400_000).toISOString(),
    read: true,
  },
];

/** Local mock of the user account data (profile, contacts, notifications). Swap for API calls later. */
@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly storage = inject(StorageService);
  private readonly auth = inject(AuthService);

  private readonly stored = signal<Partial<UserProfile>>(this.storage.get<Partial<UserProfile>>(PROFILE_KEY) ?? {});

  readonly profile = computed<UserProfile>(() => {
    const mobile = this.auth.mobile();
    return {
      name: mobile === '9876543' ? 'Meli Nakalevu' : 'Kauwai Member',
      email: '',
      dob: '',
      address: '',
      altMobile: '',
      ...this.stored(),
    };
  });

  readonly initials = computed(() =>
    this.profile()
      .name.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join(''),
  );

  readonly phone = computed(() => (this.auth.mobile() ? '+679 ' + this.auth.mobile() : ''));

  readonly pushEnabled = signal(this.storage.get<boolean>(PUSH_KEY) ?? true);

  readonly contacts = signal<Contact[]>(this.storage.get<Contact[]>(CONTACTS_KEY) ?? []);

  readonly notifications = signal<AppNotification[]>(
    this.storage.get<AppNotification[]>(NOTIFS_KEY) ?? SEED_NOTIFICATIONS,
  );
  readonly unreadCount = computed(() => this.notifications().filter((n) => !n.read).length);

  update(patch: Partial<UserProfile>): void {
    this.stored.set({ ...this.stored(), ...patch });
    this.storage.set(PROFILE_KEY, this.stored());
  }

  setPush(enabled: boolean): void {
    this.pushEnabled.set(enabled);
    this.storage.set(PUSH_KEY, enabled);
  }

  addContact(name: string, mobile: string): void {
    this.contacts.update((list) => [{ id: `c${Date.now()}`, name, mobile }, ...list]);
    this.storage.set(CONTACTS_KEY, this.contacts());
  }

  removeContact(id: string): void {
    this.contacts.update((list) => list.filter((c) => c.id !== id));
    this.storage.set(CONTACTS_KEY, this.contacts());
  }

  markRead(id: string): void {
    this.notifications.update((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
    this.storage.set(NOTIFS_KEY, this.notifications());
  }

  markAllRead(): void {
    this.notifications.update((list) => list.map((n) => ({ ...n, read: true })));
    this.storage.set(NOTIFS_KEY, this.notifications());
  }
}
