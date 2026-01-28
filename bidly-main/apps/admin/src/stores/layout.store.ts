import { computed, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BaseStore } from '@client-libs';
import { map } from 'rxjs';

export interface IMenu {
  name: string;
  href?: string;
  children?: IMenu[];
  icon?: string;
  description?: string;
  /**
   * @description 최고 관리 권한을 가진 메뉴입니다.
   */
  super?: boolean;
}

type State = {
  menus: IMenu[];
  path: string;
};

@Injectable({ providedIn: 'root' })
export class LayoutStore extends BaseStore<State> {
  menus$ = this.state$.pipe(map((state) => state.menus));
  path$ = this.state$.pipe(map((state) => state.path));

  menus = toSignal(this.menus$);
  path = toSignal(this.path$);

  currentMenu = computed<IMenu | undefined>(() => {
    const menus = this.menus();
    const path = this.path();
    if (!menus || !path) return undefined;

    const adminMenu = menus.find((menu) => menu.href === '/admin/super');
    if (
      adminMenu &&
      /^\/admin(\/|$)/.test(path) &&
      !/^\/admin\/(super|super\/)/.test(path)
    ) {
      return adminMenu;
    }

    return menus.find((menu) => {
      if (menu.children) {
        return menu.children.some(
          (child) =>
            child.href && child.href !== '' && path.includes(child.href),
        );
      }
      return menu.href && menu.href !== '' && path.includes(menu.href);
    });
  });

  currentChildMenu = computed<IMenu | undefined>(() => {
    const currentMenu = this.currentMenu();

    if (currentMenu?.children) {
      return currentMenu.children.find((child) =>
        this.path()?.includes(child.href ?? ''),
      );
    }

    return undefined;
  });

  constructor() {
    super({
      menus: [],
      path: '',
    });
  }

  setPath(path: string) {
    this.updateState({ path });
  }

  /**
   * @description 권한 기반 메뉴 필터링 포함
   */
  setMenus(menus: IMenu[], isSuperAdmin: boolean) {
    const filteredMenus = menus
      .filter((menu) => {
        if (menu.super && !isSuperAdmin) return false;
        return true;
      })
      .map((menu) => {
        if (menu.children) {
          return {
            ...menu,
            children: menu.children.filter(
              (child) => !(child.super && !isSuperAdmin),
            ),
          };
        }
        return menu;
      });

    this.updateState({ menus: filteredMenus });
  }
}
