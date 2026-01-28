/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, input } from '@angular/core';
import { BaseConfig } from '../common/config/config.adapter';
import { Icon } from '../icon/icon.component';
import { Size } from '../common/types';

@Component({
  selector: 'app-icon-button',
  template: `
    <button
      class="flex items-center cursor-pointer rounded-md theme-hover theme-text transition-colors"
      [attr.data-theme]="theme()"
      [attr.data-size]="size()"
    >
      @if (icon()) {
        <app-icon
          [size]="size()"
          [attr.data-theme]="theme()"
          [name]="icon()!"
        />
      } @else {
        <ng-content></ng-content>
      }
    </button>
  `,
  standalone: true,
  imports: [Icon],
  styles: `
    :host {
      button {
        &[data-size='md'] {
          @apply p-1.5;
        }
        &[data-size='sm'] {
          @apply p-1;
        }
      }
    }
  `,
})
export class IconButton extends BaseConfig {
  icon = input<string>();
  size = input<Size>('md');
  iconSize = input<Size>('sm');
}
