import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { BaseConfig } from '../common/config/config.adapter';

@Component({
  selector: 'app-text-field',
  template: `
    <div class="flex flex-col gap-3">
      <p class="font-semibold theme-text">
        {{ label() }}
      </p>
      <p class="break-all text-gray-500">
        <ng-content />
      </p>
    </div>
  `,
  imports: [CommonModule],
})
export class TextField extends BaseConfig {
  label = input.required<string>();
}
