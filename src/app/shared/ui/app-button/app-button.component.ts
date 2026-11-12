import { Component, input, output } from '@angular/core';
import { IonButton, IonSpinner } from '@ionic/angular';

@Component({
  selector: 'app-button',
  templateUrl: './app-button.component.html',
  styleUrls: ['./app-button.component.scss'],
  imports: [IonButton, IonSpinner],
})
export class AppButtonComponent {
  readonly variant = input<'solid' | 'outline' | 'clear'>('solid');
  readonly color = input<string>('primary');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly size = input<'small' | 'default' | 'large'>('default');
  readonly pill = input(false);
  /** Remix icon class shown before the label. */
  readonly icon = input<string>('');
  readonly block = input(true);
  readonly loading = input(false);
  readonly disabled = input(false);

  readonly pressed = output<Event>();

  onClick(event: Event): void {
    if (!this.loading() && !this.disabled()) {
      this.pressed.emit(event);
    }
  }
}
