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
        id: 'acd2d87a-3ee5-467d-90bc-08342cf32392',
      }),
  });

  menu = toObservableSignal(computed(() => this.$menu.value()));
}
