import { Injectable, computed, inject, signal } from '@angular/core';

import { StorageService } from './storage.service';

const TOKEN_KEY = 'auth_token';
const USERS_KEY = 'mock_users';
const MOBILE_KEY = 'auth_mobile';
const PIN_TTL_MS = 5 * 60 * 1000;
// Built-in demo account so login can be tried without registering.
const DEMO_MOBILE = '9876543';
const DEMO_PIN = '123456';

interface PendingPin {
  mobile: string;
  pin: string;
  expires: number;
}

/**
 * Local mock of the auth backend (demo only). Replace register/requestPin/verifyPin with
 * HttpClient calls; passwords are intentionally never persisted here.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = inject(StorageService);
  private pending: PendingPin | null = null;

  readonly token = signal<string | null>(this.storage.get<string>(TOKEN_KEY));
  readonly mobile = signal<string | null>(this.storage.get<string>(MOBILE_KEY));
  readonly isLoggedIn = computed(() => !!this.token());

  logout(): void {
    this.storage.remove(TOKEN_KEY);
    this.storage.remove(MOBILE_KEY);
    this.token.set(null);
    this.mobile.set(null);
  }

  isRegistered(mobile: string): boolean {
    return mobile === DEMO_MOBILE || (this.storage.get<string[]>(USERS_KEY) ?? []).includes(mobile);
  }

  /** Returns false when the mobile number already exists. */
  register(mobile: string): boolean {
    if (this.isRegistered(mobile)) {
      return false;
    }
    this.storage.set(USERS_KEY, [...(this.storage.get<string[]>(USERS_KEY) ?? []), mobile]);
    return true;
  }

  /** Returns the generated PIN so the demo UI can display it, or null for unknown numbers. */
  requestPin(mobile: string): string | null {
    if (!this.isRegistered(mobile)) {
      return null;
    }
    const pin = mobile === DEMO_MOBILE ? DEMO_PIN : String(Math.floor(100000 + Math.random() * 900000));
    this.pending = { mobile, pin, expires: Date.now() + PIN_TTL_MS };
    return pin;
  }

  verifyPin(mobile: string, pin: string, remember: boolean): boolean {
    const p = this.pending;
    if (!p || p.mobile !== mobile || p.pin !== pin || Date.now() > p.expires) {
      return false;
    }
    this.pending = null;
    this.startSession(mobile, remember);
    return true;
  }

  /** Creates a session without a PIN (used after a successful biometric check). */
  startSession(mobile: string, remember: boolean): void {
    const token = `mock-${mobile}-${Date.now()}`;
    if (remember) {
      this.storage.set(TOKEN_KEY, token);
      this.storage.set(MOBILE_KEY, mobile);
    }
    this.token.set(token);
    this.mobile.set(mobile);
  }
}
