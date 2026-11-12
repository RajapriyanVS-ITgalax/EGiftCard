import { Component, input, signal } from '@angular/core';
import { IonInput, IonLabel } from '@ionic/angular';

import { FormControlBase } from '../../form/form-control-base';

@Component({
  selector: 'app-input',
  templateUrl: './app-input.component.html',
  styleUrls: ['./app-input.component.scss'],
  imports: [IonInput, IonLabel],
})
export class AppInputComponent extends FormControlBase<string> {
  readonly type = input<'text' | 'email' | 'password' | 'number' | 'tel' | 'search' | 'url'>('text');
  readonly clearable = input(false);
  readonly maxlength = input<number | undefined, number | string | undefined>(undefined, {
    transform: (v) => (v === undefined || v === '' ? undefined : Number(v)),
  });
  readonly autocomplete = input<string>('off');
  /** Remix icon class, e.g. "ri-smartphone-line". */
  readonly icon = input<string>('');
  /** Rounded, label-less style that uses the placeholder as the hint. */
  readonly pill = input(false);

  readonly showPassword = signal(false);

  get effectiveType(): string {
    return this.type() === 'password' && this.showPassword() ? 'text' : this.type();
  }

  onInput(event: Event): void {
    const target = event.target as HTMLIonInputElement | null;
    let val = String((event as CustomEvent).detail?.value ?? '');
    const max = Number(this.maxlength());
    // Native maxlength is ignored for type="number", so enforce it here.
    if (max > 0 && val.length > max) {
      val = val.slice(0, max);
      if (target) {
        target.value = val;
      }
    }
    this.update(val);
  }
}
