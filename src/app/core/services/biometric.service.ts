import { Injectable, inject, signal } from '@angular/core';

import { StorageService } from './storage.service';

const BIOMETRIC_KEY = 'biometric_login';

interface BiometricRecord {
  mobile: string;
  /** Base64 WebAuthn credential id; null when the device has no platform authenticator (demo fallback). */
  credentialId: string | null;
}

const toBase64 = (buf: ArrayBuffer): string => btoa(String.fromCharCode(...new Uint8Array(buf)));
const fromBase64 = (s: string): Uint8Array<ArrayBuffer> => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

/**
 * Biometric login via the WebAuthn platform authenticator (fingerprint / Face ID / Windows Hello).
 * Demo only: no server verifies the assertion. Use a native biometric plugin for production.
 */
@Injectable({ providedIn: 'root' })
export class BiometricService {
  private readonly storage = inject(StorageService);

  private readonly record = signal<BiometricRecord | null>(this.storage.get<BiometricRecord>(BIOMETRIC_KEY));
  readonly enabled = () => this.record() !== null;
  readonly enabledMobile = () => this.record()?.mobile ?? null;

  private async hasPlatformAuthenticator(): Promise<boolean> {
    try {
      return (
        typeof PublicKeyCredential !== 'undefined' &&
        (await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())
      );
    } catch {
      return false;
    }
  }

  async enable(mobile: string): Promise<boolean> {
    let credentialId: string | null = null;
    if (await this.hasPlatformAuthenticator()) {
      try {
        const cred = (await navigator.credentials.create({
          publicKey: {
            challenge: crypto.getRandomValues(new Uint8Array(32)),
            rp: { name: 'Kauwai EGift' },
            user: { id: new TextEncoder().encode(mobile), name: mobile, displayName: mobile },
            pubKeyCredParams: [
              { type: 'public-key', alg: -7 },
              { type: 'public-key', alg: -257 },
            ],
            authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required' },
            timeout: 60_000,
          },
        })) as PublicKeyCredential | null;
        if (!cred) {
          return false;
        }
        credentialId = toBase64(cred.rawId);
      } catch {
        return false;
      }
    }
    const record = { mobile, credentialId };
    this.storage.set(BIOMETRIC_KEY, record);
    this.record.set(record);
    return true;
  }

  /** Resolves with the enrolled mobile number when the user passes the biometric check. */
  async authenticate(): Promise<string | null> {
    const rec = this.record();
    if (!rec) {
      return null;
    }
    if (!rec.credentialId) {
      return rec.mobile;
    }
    try {
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          allowCredentials: [{ type: 'public-key', id: fromBase64(rec.credentialId) }],
          userVerification: 'required',
          timeout: 60_000,
        },
      });
      return assertion ? rec.mobile : null;
    } catch {
      return null;
    }
  }

  disable(): void {
    this.storage.remove(BIOMETRIC_KEY);
    this.record.set(null);
  }
}
