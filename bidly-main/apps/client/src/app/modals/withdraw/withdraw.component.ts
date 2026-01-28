import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, Inject, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@api-client';
import { Icon, LocalStorageService, ToastService } from '@client-libs';
import { UserControllerWithdraw$Params } from 'libs/api-client/src/lib/fn/user/user-controller-withdraw';
import { UserStore } from '../../../stores/user.store';
import { ButtonType } from '../../components/button/button';

@Component({
  selector: 'app-withdraw',
  imports: [CommonModule, Icon],
  templateUrl: './withdraw.component.html',
})
export class WithdrawComponent {
  private readonly userService = inject(UserService);
  private readonly userStore = inject(UserStore);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  ButtonType = ButtonType;

  auths = computed(() => this.userStore.$user()?.auths || []);

  constructor(
    @Inject(DIALOG_DATA) public data: any,
    private dialogRef: DialogRef<any>,
  ) {
    this.userStore.fetch();
  }

  close(): void {
    this.dialogRef.close();
  }

  submit(ev?: Event): void {
    ev?.preventDefault();
    ev?.stopPropagation();

    const body: UserControllerWithdraw$Params = {
      body: {
        withdrawnReason: '',
      },
    };

    this.userService.userControllerWithdraw(body).subscribe({
      next: async () => {
        await this.localStorageService.clear();
        this.userStore.clearUser();
        this.toastService.success('탈퇴가 완료되었습니다.');
        this.dialogRef.close('withdrawn');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toastService.error(err?.message || '탈퇴에 실패했습니다.');
      },
    });
  }
}
