/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { CommonModule } from '@angular/common';
import { Component, input, model } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: Toggle,
      multi: true,
    },
  ],
})
export class Toggle implements ControlValueAccessor {
  disabled = input<boolean>(false);
  value = model<boolean>(false);

  onChange = (ev?: any) => {};
  onTouched = () => {};
  writeValue(obj: boolean): void {
    this.value.set(obj);
  }
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched = () => {};
  setDisabledState?(disabled: boolean): void {}

  handleChange(ev: any) {
    ev.stopPropagation();
    this.value.set(ev.target.checked);
    this.onChange(this.value());
    this.onTouched();
  }
}
