import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '@api-client';
import {
  Checkbox,
  Fieldset,
  Icon,
  LocalStorageService,
  ToastService,
} from '@client-libs';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@common';
import { AdminStore } from '../../../../stores/admin.store';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  imports: [
    Fieldset,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    Checkbox,
    Icon,
  ],
})
export default class SignInPage {
  readonly adminService = inject(AdminService);
  readonly localStorageService = inject(LocalStorageService);
  readonly toastService = inject(ToastService);
  readonly router = inject(Router);
  readonly userStore = inject(AdminStore);

  form = new FormGroup({
    email: new FormControl('help@lepisode.team', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: new FormControl('88782314p*', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });
  // invalid = toSignal(this.form.valueChanges.pipe(map(() => this.form.invalid)));

  /**
   * @name submit
   * @description 로그인 폼 제출 핸들러
   * @returns {void}
   */
  submit(): void {
    const body = {
      email: this.form.getRawValue().email,
      password: this.form.getRawValue().password,
    };
    this.adminService.adminControllerSignInV1({ body }).subscribe({
      next: (res) => {
        if (!res.accessToken || !res.refreshToken) {
          this.toastService.error(
            '서버에서 올바른 토큰을 반환하지 않았습니다.',
          );
          return;
        }

        this.localStorageService.set(ACCESS_TOKEN_KEY, res.accessToken);
        this.localStorageService.set(REFRESH_TOKEN_KEY, res.refreshToken);

        this.userStore
          .fetchAdmin()
          .then(() => {
            this.toastService.success('로그인에 성공했습니다.');
            this.router.navigate(['/dashboard']);
          })
          .catch((error) => {
            console.log('사용자 로그인 중 오류 발생:', error);
            console.error('사용자 정보 조회 중 오류:', error);
          });
      },
      error: (err) => {
        console.error('로그인 오류:', err);
        if (err.status === 497) {
          this.toastService.error('차단된 계정입니다. 관리자에게 문의하세요.');
          return;
        }
        this.toastService.error(
          `로그인에 실패했습니다: ${err.message || '알 수 없는 오류'}`,
        );
      },
    });
  }
}
