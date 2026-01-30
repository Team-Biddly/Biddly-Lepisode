import { Component, effect, model } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const controlValueAccessorProvider = (component: any) => ({
  provide: NG_VALUE_ACCESSOR,
  useExisting: component,
  multi: true,
});

@Component({
  selector: 'app-value-accessor-adapter',
  template: '',
})
export class ControlValueAccessorAdpater<T = any>
  implements ControlValueAccessor
{
  constructor() {
    effect(() => {
      this.onChange(this.value()!);
    });
  }

  value = model<T>();
  value$ = toObservable(this.value);

  onChange = (value: T) => {};
  onTouched = () => {};

  writeValue(obj: T): void {
    this.value.set(obj);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {}
}
