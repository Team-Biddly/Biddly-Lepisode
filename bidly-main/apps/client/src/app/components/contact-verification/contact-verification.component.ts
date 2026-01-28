import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { UserService } from '@api-client';
import { ToastService } from '@client-libs';
import { debounceTime, switchMap } from 'rxjs';

@Component({
  selector: 'app-contact-verification',
  imports: [CommonModule],
  templateUrl: './contact-verification.component.html',
  styleUrl: './contact-verification.component.css',
})
export class ContactVerificationComponent {
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  mode = input<'CREATE' | 'UPDATE'>('CREATE');
  provider = model();
  get isSingup() {
    return this.router.url.includes('sign-up');
  }

  value = model<string>('');
  token = signal<string | null>(null);
  isVerified = signal<boolean>(false);

  showValue = model<string>('');
  showValue$ = toObservable(this.showValue);
  code = signal<string | null>(null);
  isUpdating = signal<boolean>(false);

  isValidContact = computed(() => this.showValue().length === 11);

  isValidCode = computed(() => {
    const codeValue = this.code();
    return codeValue !== null && codeValue.length === 6;
  });

  isContactUnAvailable = toSignal(
    this.showValue$.pipe(
      debounceTime(500),
      switchMap((value) =>
        this.userService.userControllerCheckContact({ contact: value }),
      ),
    ),
  );

  /**
   * @name sendSmsCode
   * @description sms 인증번호 전송
   * @returns {void}
   */
  sendSmsCode(): void {
    const contact = this.showValue();
    const currentProvider = this.provider();

    if (!contact) {
      return;
    }

    if (this.isSingup && !currentProvider && this.isContactUnAvailable()) {
      this.toastService.error('이미 사용 중인 연락처입니다.');
      return;
    }

    this.userService.userControllerSendCode({ body: { contact } }).subscribe({
      next: (res: { token?: string }) => {
        this.token.set(res.token || null);
        console.debug('SMS token:', this.token());
        this.toastService.success('인증번호가 전송되었습니다.');
      },
      error: (error) => {
        console.error(error);
        this.toastService.error(error.error?.message || '');
      },
    });
  }

  /**
   * @name verifySmsCode
   * @description sms 인증번호 확인
   * @returns {void}
   */
  verifySmsCode(): void {
    const contact = this.showValue();
    const token = this.token();

    if (!contact) {
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
        body: { contact, code: this.code()!, token },
      })
      .subscribe({
        next: (isVerified: boolean) => {
          if (isVerified) {
            this.isVerified.set(true);
            this.value.set(contact);
            this.toastService.success('인증번호가 확인되었습니다.');
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
    this.showValue.set(input.value || '');
  }

  handleCodeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.code.set(input.value || '');
  }

  handleUpdateMode(): void {
    this.showValue.set('');
    this.value.set('');
    this.isUpdating.set(true);
  }
}
