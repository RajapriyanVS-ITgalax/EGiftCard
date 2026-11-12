import { Injectable } from '@angular/core';

/** Thin typed wrapper over localStorage; swap for @ionic/storage when native persistence is needed. */
@Injectable({ providedIn: 'root' })
export class StorageService {
  get<T>(key: string): T | null {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return null;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
