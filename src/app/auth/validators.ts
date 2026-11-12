import type { AbstractControl, ValidationErrors } from '@angular/forms';

export const MOBILE_PATTERN = /^\d{7,10}$/;

export function matchControls(a: string, b: string) {
  return (group: AbstractControl): ValidationErrors | null => {
    const x = group.get(a);
    const y = group.get(b);
    if (!x || !y) {
      return null;
    }
    const mismatch = !!y.value && x.value !== y.value;
    // Set on the confirm control so app-input displays it.
    const rest = { ...(y.errors ?? {}) };
    delete rest['mismatch'];
    y.setErrors(mismatch ? { ...rest, mismatch: true } : Object.keys(rest).length ? rest : null);
    return null;
  };
}
