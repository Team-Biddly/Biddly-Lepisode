/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MenuDto, MenuPermissionDto } from '@api-client';
import { injectNavigationEnd } from 'ngxtension/navigation-end';
import { toObservableSignal } from 'ngxtension/to-observable-signal';
import { MenuStore } from '../stores/menu.store';
import { AdminStore } from '../stores/admin.store';

/**
 * 권한 미들웨어
 * 사용자의 권한을 확인하고, 권한이 없는 경우 에러 페이지로 리다이렉트합니다.
 */
@Component({
  selector: 'app-permission-middleware',
  template: '',
})
export class PermissionMiddleware implements OnInit {
  private readonly menuStore = inject(MenuStore);
  private readonly adminStore = inject(AdminStore);
  private readonly menu = this.menuStore.menu;
  readonly admin = this.adminStore.user;

  readonly router = inject(Router);
  readonly navigationEnd$ = injectNavigationEnd();

  /**
   * 현재 접속한 페이지의 권한 정보
   */
  private currentPermission = signal<MenuDto | null>(null);
  private currentPermission$ = toObservableSignal(this.currentPermission);

  ngOnInit() {
    this.handleFindMenu();

    this.navigationEnd$.subscribe({
      next: () => {
        this.handleFindMenu();
      },
    });

    this.currentPermission$.subscribe({
      next: (res) => {
        const admin = this.admin();

        // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
        if (!admin) {
          this.router.navigate(['/sign-in']);
          return;
        }

        this.handlePermission(res!);
      },
    });
  }

  /**
   * 현재 경로에 해당하는 메뉴를 찾습니다.
   */
  private handleFindMenu() {
    const path = window.location.pathname;
    this.currentPermission.set(null);

    this.menu.subscribe({
      next: (menu) => {
        if (menu) {
          this.findMenuItem(menu, path);
        }
      },
    });
  }

  /**
   * 현재 메뉴의 권한을 확인합니다.
   * @param menu
   */
  private handlePermission(menu: MenuDto) {
    const admin = this.admin();

    if (menu) {
      // 권한 체크
      const permissionList = this.findPermission(menu);
      if (!permissionList || !permissionList?.length) return;
    }
  }

  /**
   * 재귀적으로 메뉴를 탐색하여 현재 메뉴의 권한을 찾습니다.
   * @param menu
   * @returns
   */
  private findPermission(menu: MenuDto): MenuPermissionDto[] {
    if (menu) {
      const permissionList = menu.permissions as MenuPermissionDto[];

      if (permissionList?.length === 0) {
        return this.findPermission(menu.parent);
      }

      return permissionList;
    }

    return [];
  }

  /**
   *  재귀적으로 메뉴를 탐색하여 현재 경로와 일치하는 메뉴를 찾습니다.
   * @param menu
   * @param path
   * @returns
   */
  private findMenuItem(menu: any, path: string) {
    if (!menu) return;

    // 현재 메뉴에서 탐색
    menu.children?.forEach((item: any) => {
      if (item.routeUrl === path) {
        this.currentPermission.set(item);
      }

      // 재귀 호출 (하위 메뉴 탐색)
      this.findMenuItem(item, path);
    });
  }
}
