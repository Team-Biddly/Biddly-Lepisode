/* eslint-disable @angular-eslint/component-class-suffix */
import { CommonModule } from '@angular/common';
import {
  afterNextRender,
  Component,
  ElementRef,
  input,
  model,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-input-text-search',
  templateUrl: './input-text-search.component.html',
  imports: [CommonModule],
})
export class InputTextSearch {
  inputElement = viewChild<ElementRef>('input');

  class = input<string>('');
  maxLength = input<number>(50);
  placeholder = input<string>('');
  readonly = input<boolean>(false);
  inputMode = input<string>('text');

  value = model<string>('');

  constructor() {
    afterNextRender(() => {
      if (this.inputElement()) {
        this.inputElement()!.nativeElement.value = this.value();
        this.value.set('');
      }
    });
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.value.set(inputElement.value);
  }
}
