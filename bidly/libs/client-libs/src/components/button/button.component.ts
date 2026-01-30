/* eslint-disable @angular-eslint/component-class-suffix */
import {
  booleanAttribute,
  Component,
  computed,
  HostBinding,
  input,
} from '@angular/core';
import { BaseConfig } from '../common/config/config.adapter';
import { Color, Rounded, Size, Variant } from '../common/types';
import { Icon } from '../icon/icon.component';
import { ButtonPressDirective } from '../../animations/buttonPress.directive';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [Icon, ButtonPressDirective],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class Button extends BaseConfig {
  @HostBinding('class') get hostClass() {
    if (this.expand()) {
      return 'w-full';
    }

    return null;
  }

  size = input<Size>();
  color = input<Color>();
  rounded = input<Rounded>();
  type = input<'button' | 'submit' | 'reset'>('button');
  icon = input<string>();
  variant = input<Variant>('solid');
  expand = input<boolean, string | boolean>(false, {
    transform: booleanAttribute,
  });
  loading = input<boolean>(false);
  disabled = input<boolean, string | boolean>(false, {
    transform: booleanAttribute,
  });

  // loading이 true일 때 icon override
  currentIcon = computed(() => {
    if (this.loading()) {
      return 'svg-spinners:ring-resize';
    }

    return this.icon();
  });

  config = computed(() => this.globalConfig()?.button);
  currentSize = computed(() => this.size() || this.config()?.size || 'md');
  currentColor = computed(
    () => this.color() || this.config()?.color || 'primary',
  );
  currentRounded = computed(
    () => this.rounded() || this.config()?.rounded || 'md',
  );
}
