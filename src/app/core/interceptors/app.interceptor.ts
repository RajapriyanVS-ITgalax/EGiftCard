import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

/** Prefixes relative API URLs with the API base and attaches the bearer token; static assets pass through. */
export const appInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('assets/') || req.url.startsWith('/assets/')) {
    return next(req);
  }
  const token = inject(AuthService).token();
  const isRelative = !/^https?:\/\//i.test(req.url);
  const url = isRelative ? `${environment.apiUrl}/${req.url.replace(/^\//, '')}` : req.url;
  const headers = token && isRelative ? req.headers.set('Authorization', `Bearer ${token}`) : req.headers;
  return next(req.clone({ url, headers }));
};
