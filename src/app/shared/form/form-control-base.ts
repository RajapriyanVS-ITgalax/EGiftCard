import { Directive, inject, input, signal } from '@angular/core';
import type { ControlValueAccessor } from '@angular/forms';
import { NgControl, Validators } from '@angular/forms';

const DEFAULT_ERROR_MESSAGES: Record<string, (e: any) => string> = {
  required: () => 'This field is required',
  email: () => 'Enter a valid email address',
  minlength: (e) => `Minimum ${e.requiredLength} characters required`,
  maxlength: (e) => `Maximum ${e.requiredLength} characters allowed`,
  min: (e) => `Minimum value is ${e.min}`,
  max: (e) => `Maximum value is ${e.max}`,
  pattern: () => 'Invalid format',
};

/** Shared ControlValueAccessor plumbing for all form controls. */
@Directive()
export abstract class FormControlBase<T = string> implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly helperText = input<string>('');
  readonly errorMessages = input<Record<string, string>>({});
  /** Forces validation errors to show even if the control is untouched/pristine. */
  readonly errorTrue = input<boolean>(false);

  readonly value = signal<T | null>(null);
  readonly disabled = signal(false);
  readonly touched = signal(false);

  protected readonly ngControl = inject(NgControl, { self: true, optional: true });
  private onChange: (v: T | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  get errorText(): string {
    const control = this.ngControl?.control;
    if (!control || !control.invalid || !(control.touched || control.dirty || this.errorTrue())) {
      return '';
    }
    const [key, detail] = Object.entries(control.errors ?? {})[0] ?? [];
    if (!key) {
      return '';
    }
    return this.errorMessages()[key] ?? DEFAULT_ERROR_MESSAGES[key]?.(detail) ?? 'Invalid value';
  }

  get isRequired(): boolean {
    return !!this.ngControl?.control?.hasValidator(Validators.required);
  }

  writeValue(v: T | null): void {
    this.value.set(v);
  }

  registerOnChange(fn: (v: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected update(v: T | null): void {
    this.value.set(v);
    this.onChange(v);
  }

  markTouched(): void {
    this.touched.set(true);
    this.onTouched();
  }
}
