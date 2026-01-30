import { computed, inject, Injectable } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MenuService } from '@api-client';
import { toObservableSignal } from 'ngxtension/to-observable-signal';

@Injectable({ providedIn: 'root' })
export class MenuStore {
  readonly menuService = inject(MenuService);

  private readonly $menu = rxResource({
    stream: () =>
      this.menuService.menuControllerFindById({
        id: 'b2b9b87c-3676-4daa-8bc6-75018c73080a',
      }),
  });

  menu = toObservableSignal(computed(() => this.$menu.value()));
}
