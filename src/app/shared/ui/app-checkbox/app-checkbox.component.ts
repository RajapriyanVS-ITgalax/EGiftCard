import { Component, input } from '@angular/core';
import { IonCheckbox } from '@ionic/angular';

import { FormControlBase } from '../../form/form-control-base';

@Component({
  selector: 'app-checkbox',
  templateUrl: './app-checkbox.component.html',
  styleUrls: ['./app-checkbox.component.scss'],
  imports: [IonCheckbox],
})
export class AppCheckboxComponent extends FormControlBase<boolean> {
  readonly labelPlacement = input<'start' | 'end'>('end');

  onValueChange(event: Event): void {
    this.update(!!(event as CustomEvent).detail?.checked);
  }
}
