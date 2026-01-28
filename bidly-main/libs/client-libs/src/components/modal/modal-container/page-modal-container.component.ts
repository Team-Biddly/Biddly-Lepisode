import { CommonModule, Location } from '@angular/common';
import { booleanAttribute, Component, inject, input } from '@angular/core';
import { Icon } from '../../icon/icon.component';

@Component({
  selector: 'app-page-modal-container',
  standalone: true,
  imports: [CommonModule, Icon],
  template: `<main
    [class.xl:hidden]="!desktop()"
    class="bg-white absolute z-[999] inset-0 w-full min-h-screen h-full sm:hidden slide"
  >
    <section
      class="fixed top-0 z-10 flex items-center justify-between w-full p-4 bg-white border-b border-gray-100"
    >
      @if (title()) {
        <h4>{{ title() }}</h4>
      }

      <app-icon
        (click)="goBack()"
        name="mdi:close"
        class="bg-gray-700 cursor-pointer ml-auto"
        size="sm"
      />

      <ng-content select="[icons]" />
    </section>
    <section class="z-50 h-full pb-20 pt-[49px]">
      <ng-content />
    </section>
    <section class="fixed bottom-0 w-full bg-white border-t border-gray-100">
      <ng-content select="[footer]" />
    </section>
  </main> `,
})
export class PageModalContainer {
  location = inject(Location);
  desktop = input(false, { transform: booleanAttribute });
  title = input<string>();

  slideEnabled = input(true, { transform: booleanAttribute });

  goBack() {
    this.location.back();
  }
}
