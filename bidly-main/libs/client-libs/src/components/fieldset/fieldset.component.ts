import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, input } from '@angular/core';
import { Icon } from '../icon/icon.component';
import { TooltipDirective } from '../../directives/tooltip.directive';

@Component({
  selector: 'app-fieldset',
  template: `
    <fieldset class="fieldset select-none">
      @if (label() || tooltip()) {
        <div class="flex items-center gap-3">
          @if (label(); as label) {
            <legend class="relative fieldset-legend min-w-max">
              <span>
                {{ label }}
              </span>
              @if (required()) {
                <span
                  class="absolute left-[calc(100%+4px)] text-primary bottom-4"
                  >*</span
                >
              }
            </legend>
          }
          @if (tooltip(); as tooltip) {
            <div class="flex w-full justify-end">
              <app-icon
                [appTooltip]="tooltip"
                name="material-symbols:info"
                class="text-gray-500 mt-1"
              />
            </div>
          }
        </div>
      }
      <ng-content></ng-content>
    </fieldset>
  `,
  imports: [CommonModule, Icon, TooltipDirective],
})
export class Fieldset {
  required = input<boolean, string>(false, { transform: booleanAttribute });
  label = input<string>('');
  tooltip = input<string>('');
}
