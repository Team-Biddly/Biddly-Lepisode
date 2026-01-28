import { Component, input } from '@angular/core';
import { Icon } from '@client-libs';

@Component({
  selector: 'app-hint',
  template: `
    <div class="flex items-center gap-2">
      <div class="min-w-5 flex items-center justify-center">
        <app-icon
          name="solar:info-circle-bold-duotone"
          size="sm"
          class="text-gray-500"
        />
      </div>
      <p class="text-sm text-gray-500" [class.whitespace-pre-line]="!noWrap()">
        <ng-content />
      </p>
    </div>
  `,
  imports: [Icon],
  standalone: true,
})
export class Hint {
  noWrap = input<boolean>(false);
}
