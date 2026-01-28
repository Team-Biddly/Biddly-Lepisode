/* eslint-disable @nx/enforce-module-boundaries */
import { CommonModule, Location } from '@angular/common';
import { afterNextRender, Component, computed, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '@api-client';
import { fnDebugForm, Icon, ModalService, ToastService } from '@client-libs';
import { ContactVerificationComponent } from 'apps/client/src/app/components/contact-verification/contact-verification.component';
import { EmailVerificationComponent } from 'apps/client/src/app/components/email-verification/email-verification.component';
import { UserControllerUpdate$Params } from 'libs/api-client/src/lib/fn/user/user-controller-update';
import { UserStore } from '../../../../../stores/user.store';
import { WithdrawComponent } from '../../../../modals/withdraw/withdraw.component';

@Component({
  selector: 'app-update-my-info',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Icon,
    ContactVerificationComponent,
    EmailVerificationComponent,
  ],
  templateUrl: './update-my-info.page.html',
  styleUrl: './update-my-info.page.css',
})
export default class UpdateMyInfoPage {
  private readonly toastService = inject(ToastService);
  private readonly userService = inject(UserService);
  private readonly modalService = inject(ModalService);
  private readonly userStore = inject(UserStore);
  private readonly location = inject(Location);

  contactCodeVerified = false;
  emailCodeVerified = false;
  smsToken = '';
  emailToken = '';

  user = this.userStore.$user;
  isEmailUser = this.userStore.isEmailUser;
  isLinkedUser = computed(() => {
    const auths = this.user()?.auths ?? [];
    const providers = auths.map((auth) => auth.provider);

    return (
      providers.includes('EMAIL') &&
      (providers.includes('KAKAO') || providers.includes('GOOGLE'))
    );
  });

  infoForm = new FormGroup({
    name: new FormControl(''),
    contact: new FormControl(''),
    email: new FormControl(''),
    emailCode: new FormControl(''),
  });

  constructor() {
    afterNextRender(async () => {
      await this.userStore.fetch();

      this.infoForm.patchValue({
        name: this.user()?.name || '',
        contact: this.user()?.contact || '',
        email: this.user()?.auths?.[0]?.email || '',
        emailCode: '',
      });

      if (this.userStore.isEmailUser) {
        this.infoForm.get('contact')?.addValidators(Validators.required);
        this.infoForm.get('contact')?.updateValueAndValidity();
      }

      fnDebugForm(this.infoForm);
    });
  }

  /**
   * @name sendEmailCode
   * @description 이메일 인증번호 전송
   * @returns {void}
   */
  sendEmailCode(): void {
    const email = this.infoForm.value.email;

    if (!email) {
      this.toastService.error('이메일을 입력해주세요.');
      return;
    }

    this.userService
      .userControllerSendEmailCode({ body: { email } })
      .subscribe({
        next: (res: { token?: string }) => {
          this.emailToken = res.token!;
          console.debug('Email token:', this.emailToken);
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
   * @param {void} code
   * @returns {void}
   */
  verifyEmailCode(code: string): void {
    const email = this.infoForm.value.email;
    const token = this.emailToken;

    if (!email || !code) {
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
      .userControllerVerifyEmailCode({ body: { email, code, token } })
      .subscribe({
        next: (isVerified: boolean) => {
          if (isVerified) {
            this.emailCodeVerified = true;
            this.toastService.success('이메일 인증이 완료되었습니다.');
          } else {
            this.emailCodeVerified = false;
            this.toastService.error('인증번호가 일치하지 않습니다.');
          }
        },
        error: (error) => {
          this.emailCodeVerified = false;
          const msg = error.error?.message || '';
          if (!msg) return;
          this.toastService.error(msg);
        },
      });
  }

  isFormChanged(): boolean {
    const original = this.user();
    const form = this.infoForm.value;

    const nameChanged = form.name !== original?.name;
    const contactChanged = form.contact !== original?.contact;
    const emailChanged = form.email !== original?.auths?.[0]?.email;

    const emailValid = emailChanged ? this.emailCodeVerified : false;

    return nameChanged || emailValid;
  }

  onSubmitInfo(ev?: Event): void {
    ev?.preventDefault();

    const payload: UserControllerUpdate$Params = {
      body: {
        name: this.infoForm.getRawValue().name || '',
        contact: this.infoForm.getRawValue().contact || '',
        email: this.infoForm.getRawValue().email ?? '',
      },
    };

    this.userService.userControllerUpdate(payload).subscribe({
      next: async () => {
        this.toastService.success('정보가 수정되었습니다.');
        await this.userStore.fetch();
      },
      error: (err) => {
        this.toastService.error(
          err?.error.message || '정보 수정에 실패했습니다.',
        );
      },
    });
  }

  goBack() {
    this.location.back();
  }

  withdraw() {
    this.modalService.create(WithdrawComponent).closed.subscribe({
      next: async (result) => {
        if (result !== 'withdrawn') return;
        await this.userStore.fetch();
        this.toastService.success('회원 탈퇴가 완료되었습니다.');
      },
      error: (err) => {
        this.toastService.error(err?.message || '회원 탈퇴에 실패했습니다.');
      },
    });
  }
}
