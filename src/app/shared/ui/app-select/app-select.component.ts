import { Component, input } from '@angular/core';
import { IonSelect, IonSelectOption } from '@ionic/angular';

import { FormControlBase } from '../../form/form-control-base';

export interface SelectOption {
  value: string | number;
  label: string;
}

@Component({
  selector: 'app-select',
  templateUrl: './app-select.component.html',
  styleUrls: ['./app-select.component.scss'],
  imports: [IonSelect, IonSelectOption],
})
export class AppSelectComponent extends FormControlBase<string | number> {
  readonly options = input<SelectOption[]>([]);

  onValueChange(event: Event): void {
    this.update((event as CustomEvent).detail?.value ?? null);
  }
}
