import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Color, Size } from '../common/types';
import {
  ControlValueAccessorAdpater,
  controlValueAccessorProvider,
} from '../common/value-accessor';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  imports: [CommonModule, FormsModule],
  providers: [controlValueAccessorProvider(Checkbox)],
})
export class Checkbox extends ControlValueAccessorAdpater<boolean> {
  label = input<string>();
  color = input<Color>();
  size = input<Size>();

  currentColor = computed(() => `checkbox-${this.color() || 'primary'}`);
  currentSize = computed(() => `checkbox-${this.size() || 'md'}`);
}
