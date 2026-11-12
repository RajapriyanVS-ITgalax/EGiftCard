import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { shareReplay } from 'rxjs';

import type { AppData } from '../models/app-data.model';

export const DATA_URL = 'assets/data/data.json';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly http = inject(HttpClient);
  readonly data$: Observable<AppData> = this.http.get<AppData>(DATA_URL).pipe(shareReplay(1));
}
