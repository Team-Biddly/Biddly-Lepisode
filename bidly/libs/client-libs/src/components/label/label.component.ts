/* eslint-disable @angular-eslint/component-class-suffix */
import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Color, Size } from '../common/types';
import { BaseConfig } from '../common/config/config.adapter';

@Component({
  selector: 'app-label',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./label.component.scss'],
  template: `
    <p
      class="theme-text font-semibold text-neutral-900"
      [attr.data-size]="currentSize()"
      [attr.data-theme]="theme()"
    >
      <ng-content />
      @if (required()) {
        <span
          [attr.data-color]="currentColor()"
          class="absolute bottom-[calc(100%-20px)]"
          >*</span
        >
      }
    </p>
  `,
})
export class Label extends BaseConfig {
  required = input<boolean>(false);
  size = input<Size>();
  color = input<Color>();
  config = computed(() => this.globalConfig()?.label);
  currentSize = computed(() => this.size() || this.config()?.size || 'md');
  currentColor = computed(
    () => this.color() || this.config()?.color || 'primary',
  );
}
