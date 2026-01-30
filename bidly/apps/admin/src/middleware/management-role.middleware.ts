import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_ADMIN_PERMISSION_NAME, MAX_LEVEL } from '@common';
import { injectNavigationEnd } from 'ngxtension/navigation-end';
import { AdminStore } from '../stores/admin.store';

/**
 * 역할,권한,메뉴 관리 페이지에서 사용되는 미들웨어입니다.
 */
@Component({
  selector: 'app-management-middleware',
  template: '',
})
export class ManagementMiddleware implements OnInit {
  private readonly adminStore = inject(AdminStore);
  private readonly admin = this.adminStore.user;

  readonly router = inject(Router);
  readonly navigationEnd$ = injectNavigationEnd();

  ngOnInit() {
    this.handlePermission();

    this.navigationEnd$.subscribe({
      next: () => {
        this.handlePermission();
      },
    });
  }

  handlePermission() {
    this.admin.subscribe({
      next: (admin) => {
        if (!admin) {
          this.router.navigate(['/']);
          return;
        }

        // 최고 권한일 경우
        if (admin.role === 'SUPER_ADMIN') {
          return;
        }

        if (admin.role !== 'NORMAL') {
          this.router.navigate(['/error/no-permission']);
        }
      },
    });
  }
}
