import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '@api-client';
import { LocalStorageService, ToastService } from '@client-libs';
import { ACCESS_TOKEN_KEY } from '@common';
import { UserControllerGetAccessTokenByContact$Params } from 'libs/api-client/src/lib/fn/user/user-controller-get-access-token-by-contact';
import { map } from 'rxjs';
import { UserStore } from '../../../../stores/user.store';
import { ContactVerificationComponent } from '../../../components/contact-verification/contact-verification.component';

@Component({
  selector: 'app-find-email',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    ContactVerificationComponent,
  ],
  templateUrl: './find-email.page.html',
  styleUrl: './find-email.page.css',
})
export default class FindEmailPage {
  private readonly userService = inject(UserService);
  private readonly userStore = inject(UserStore);
  private readonly toastService = inject(ToastService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly router = inject(Router);

  smsToken = '';
  contactCodeVerified = false;

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    contact: new FormControl('', [
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(11),
    ]),
  });

  /**
   * @name sendSmsCode
   * @description sms 인증번호 전송
   * @returns {void}
   */
  sendSmsCode(): void {
    if (this.contactCodeVerified) {
      this.toastService.error('연락처 인증이 완료되었습니다.');
      return;
    }

    const contact = this.form.value.contact;

    if (!contact) {
      this.toastService.error('연락처를 입력해주세요.');
      return;
    }

    if (contact.length !== 11) {
      this.toastService.error('올바른 연락처를 입력해주세요.');
      return;
    }

    this.userService.userControllerSendCode({ body: { contact } }).subscribe({
      next: (res: { token?: string }) => {
        this.smsToken = res.token!;
        console.debug('SMS token:', this.smsToken);
        this.toastService.success('인증번호가 전송되었습니다.');
      },
      error: (error) => {
        const msg = error.error?.message || '';
        if (!msg) return;
        this.toastService.error(msg);
      },
    });
  }

  /**
   * @name verifySmsCode
   * @description sms 인증번호 확인
   * @param {string} code
   * @returns {void}
   */
  verifySmsCode(code: string): void {
    if (this.contactCodeVerified) {
      this.toastService.error('연락처 인증이 완료되었습니다.');
      return;
    }

    const contact = this.form.value.contact!;
    const token = this.smsToken;

    if (!contact || !code) {
      this.toastService.error('연락처와 인증번호를 입력해주세요.');
      return;
    }

    if (!token) {
      this.toastService.error(
        '인증 토큰이 없습니다. 먼저 인증번호를 요청해주세요.',
      );
      return;
    }

    this.userService
      .userControllerVerifyCode({
        body: { contact, code, token },
      })
      .subscribe({
        next: (isVerified: boolean) => {
          if (isVerified) {
            this.contactCodeVerified = true;
            this.toastService.success('인증번호가 확인되었습니다.');
          } else {
            this.contactCodeVerified = false;
            this.toastService.error('인증번호가 일치하지 않습니다.');
          }
        },
        error: (error) => {
          this.contactCodeVerified = false;
          const msg = error.error?.message || '';
          if (!msg) return;
          this.toastService.error(msg);
        },
      });
  }

  /**
   * @name sanitizeContact
   * @description 연락처에서 숫자만 추출합니다.
   * @param {string} contact - 연락처 문자열
   * @returns {string}
   */
  private sanitizeContact(contact: string): string {
    const sanitized = contact.replace(/[^0-9]/g, '');
    return sanitized;
  }

  submit(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    this.userService
      .userControllerGetAccessTokenByContact({
        contact: this.sanitizeContact(this.form.value.contact ?? ''),
      } as UserControllerGetAccessTokenByContact$Params)
      .subscribe({
        next: (res) => {
          if (!res.accessToken) {
            this.toastService.error('이메일을 찾을 수 없습니다.');
            return;
          }
          this.localStorageService.set(ACCESS_TOKEN_KEY, res.accessToken);
          this.userStore.fetch();
          this.toastService.success('이메일 찾기 성공');
          this.router.navigateByUrl('/user/confirm-email');
        },
        error: (error) => {
          console.error(error);
          this.toastService.error(
            '이메일 찾기에 실패했습니다. 다시 시도해주세요.',
          );
        },
      });

    this.router.navigateByUrl('/user/confirm-email');
  }
}
