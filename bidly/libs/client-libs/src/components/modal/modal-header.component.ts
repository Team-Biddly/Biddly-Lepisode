import { Component } from '@angular/core';
import { Icon } from '../icon/icon.component';
import { ModalBasement } from './modal.adapter';

@Component({
  selector: 'app-modal-header',
  template: `
    <section
      class="z-10 flex justify-between w-full px-4 bg-white border-b border-gray-100"
    >
      <div
        class="flex relative gap-2 items-center h-12 w-full justify-between font-semibold"
      >
        <p class="font-medium text-gray-800 sm:text-lg">
          <ng-content />
        </p>
        <app-icon
          (click)="close()"
          name="mdi:close"
          class="text-gray-800 cursor-pointer"
        />
      </div>
      <ng-content select="[icons]" />
    </section>
  `,
  imports: [Icon],
})
export class ModalHeader extends ModalBasement {}
