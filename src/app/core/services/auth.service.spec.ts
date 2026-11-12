import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let auth: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    auth = TestBed.inject(AuthService);
  });

  it('registers once and rejects duplicates', () => {
    expect(auth.register('71234567')).toBe(true);
    expect(auth.register('71234567')).toBe(false);
  });

  it('refuses a PIN for unknown numbers', () => {
    expect(auth.requestPin('70000000')).toBeNull();
  });

  it('logs in with the issued PIN only', () => {
    auth.register('71234567');
    const pin = auth.requestPin('71234567') as string;
    expect(auth.verifyPin('71234567', '000000', true)).toBe(false);
    expect(auth.verifyPin('71234567', pin, true)).toBe(true);
    expect(auth.isLoggedIn()).toBe(true);
    auth.logout();
    expect(auth.isLoggedIn()).toBe(false);
  });
});
