import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { UserService } from '@api-client';
import { ToastService } from '@client-libs';
import { SignupStore } from '../../pages/auth/sign-up/store/signup.store';

@Component({
  selector: 'app-email-verification',
  imports: [CommonModule],
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.css',
})
export class EmailVerificationComponent {
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);
  private readonly signupStore = inject(SignupStore);

  mode = input<'CREATE' | 'UPDATE'>('CREATE');

  value = model<string>('');
  token = signal<string | null>(null);
  isVerified = signal<boolean>(false);

  showValue = model<string>('');
  code = signal<string | null>(null);
  isUpdating = signal<boolean>(false);

  isEmailValid = computed(() => {
    const value = this.showValue().trim();
    return value.length > 0 && this.isValidEmail(value);
  });

  isValidCode = computed(() => {
    const codeValue = this.code();
    return codeValue !== null && codeValue.length === 6;
  });

  oAuthCreateDto = this.signupStore.oAuthCreateDto;

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isSocialLogin() {
    // return this.userService.
  }

  /**
   * @name sendEmailCode
   * @description 이메일 인증번호 전송
   * @returns {void}
   */
  sendEmailCode(): void {
    if (!this.showValue()) {
      this.toastService.error('이메일을 입력해주세요.');
      return;
    }

    this.userService
      .userControllerSendEmailCode({ body: { email: this.showValue() } })
      .subscribe({
        next: (res: { token?: string }) => {
          this.token.set(res.token || null);
          console.debug('Email token:', this.token());
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
   * @name verifyEmailCode
   * @description 이메일 인증번호 확인
   * @returns {void}
   */
  verifyEmailCode(): void {
    const email = this.showValue();
    const token = this.token();

    if (!email) {
      this.toastService.error('이메일과 인증번호를 입력해주세요.');
      return;
    }

    if (!token) {
      this.toastService.error(
        '인증 토큰이 없습니다. 먼저 인증번호를 요청해주세요.',
      );
      return;
    }

    this.userService
      .userControllerVerifyEmailCode({
        body: { email, code: this.code(), token },
      })
      .subscribe({
        next: (isVerified: boolean) => {
          if (isVerified) {
            this.isVerified.set(true);
            this.value.set(email);
            this.toastService.success('이메일 인증이 완료되었습니다.');
          } else {
            this.isVerified.set(false);
            this.toastService.error('인증번호가 일치하지 않습니다.');
          }
        },
        error: (error) => {
          this.isVerified.set(false);
          console.error(error);
          this.toastService.error(error.error?.message || '');
        },
      });
  }

  handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.showValue.set(input.value);
  }

  handleCodeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.code.set(input.value);
  }

  handleUpdateMode(): void {
    this.showValue.set('');
    this.value.set('');
    this.isUpdating.set(true);
  }
}
