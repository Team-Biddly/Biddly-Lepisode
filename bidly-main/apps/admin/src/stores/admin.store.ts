import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AdminDto, AdminService } from '@api-client';
import { BaseStore, LocalStorageService, ToastService } from '@client-libs';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@common';
import { toObservableSignal } from 'ngxtension/to-observable-signal';
import { lastValueFrom } from 'rxjs';

type State = {
  admin: AdminDto | null;
};

@Injectable({ providedIn: 'root' })
export class AdminStore extends BaseStore<State> {
  private readonly adminService = inject(AdminService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  user = toObservableSignal(computed(() => this.state()?.admin));

  constructor() {
    super({
      admin: null,
    });
  }

  async fetchAdmin() {
    // try {
    //   const admin = await lastValueFrom(
    //     this.adminService.adminControllerGetMeV1(),
    //   );

    //   if (!admin) {
    //     this.router.navigate(['/sign-in']);
    //     this.toastService.error('접근 권한이 없습니다.');
    //     await this.logout();
    //   } else {
    //     if (admin.blockedLogs === null) {
    //       admin.blockedLogs = [];
    //     }
    //     this.setUser(admin);
    //   }
    // } catch (error) {
    //   console.error('사용자 정보 조회 중 오류:', error);
    //   this.toastService.error('사용자 정보를 불러오는 중 오류가 발생했습니다.');
    //   await this.logout();
    // }
    const admin = await lastValueFrom(
      this.adminService.adminControllerGetMeV1(),
    ).catch(() => null);

    if (admin) {
      this.setUser(admin);
    } else {
      this.clearUser();
    }
  }

  async logout() {
    await lastValueFrom(this.adminService.adminControllerLogoutV1());
    this.localStorageService.remove(ACCESS_TOKEN_KEY);
    this.localStorageService.remove(REFRESH_TOKEN_KEY);
    this.clearUser();
    this.router.navigate(['/sign-in']);
  }

  setUser(admin: AdminDto) {
    this.updateState({ admin });
  }

  clearUser() {
    this.updateState({ admin: null });
  }
}
