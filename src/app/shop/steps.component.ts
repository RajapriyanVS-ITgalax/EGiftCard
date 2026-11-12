import { Component, input } from '@angular/core';

@Component({
  selector: 'app-steps',
  template: `
    <div class="steps" style="padding-bottom: 8px">
      @for (label of labels; track label; let i = $index) {
        @if (i > 0) {
          <span class="line"></span>
        }
        <div class="step" [class.active]="current() === i + 1" [class.done]="current() > i + 1">
          <span>{{ current() > i + 1 ? '✓' : i + 1 }}</span>
          {{ label }}
        </div>
      }
    </div>
  `,
  styles: `
    .steps {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 12px;
      font-family: 'Poppins', sans-serif;
    }
    .step {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--ion-color-medium);
    }
    .step span {
      display: grid;
      place-items: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #dbe6f1;
      font-weight: 700;
    }
    .step.active {
      color: var(--ion-color-primary);
      font-weight: 600;
    }
    .step.active span {
      background: var(--ion-color-primary);
      color: #fff;
    }
    .step.done span {
      background: #12b5a0;
      color: #fff;
    }
    .line {
      width: 28px;
      height: 2px;
      background: #dbe6f1;
    }
  `,
})
export class StepsComponent {
  readonly current = input.required<1 | 2 | 3>();
  readonly labels = ['Recipient', 'Payment', 'Review'];
}
