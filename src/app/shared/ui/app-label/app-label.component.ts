import { Component, input } from '@angular/core';

/** Read-only "label: value" pair for detail screens. */
@Component({
  selector: 'app-label',
  templateUrl: './app-label.component.html',
  styleUrls: ['./app-label.component.scss'],
})
export class AppLabelComponent {
  readonly label = input.required<string>();
  readonly value = input<string | number | null | undefined>('');
}
