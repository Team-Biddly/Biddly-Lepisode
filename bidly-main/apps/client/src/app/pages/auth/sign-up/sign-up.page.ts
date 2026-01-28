import { CommonModule } from '@angular/common';
import { Component, afterNextRender, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  CreateUserDto,
  OAuthService,
  OauthCreateDto,
  PolicyService,
  TokenDto,
  UserDto,
  UserService,
} from '@api-client';
import {
  Checkbox,
  LocalStorageService,
  ModalService,
  ToastService,
} from '@client-libs';
import { ACCESS_TOKEN_KEY, Policy } from '@common';
import { AuthProvider } from '@prisma/client';
import { OauthControllerConnect$Params } from 'libs/api-client/src/lib/fn/o-auth/oauth-controller-connect';
import { UserControllerGetAccessTokenByEmail$Params } from 'libs/api-client/src/lib/fn/user/user-controller-get-access-token-by-email';
import { UserControllerSignUpWithSns$Params } from 'libs/api-client/src/lib/fn/user/user-controller-sign-up-with-sns';
import { lastValueFrom } from 'rxjs';
import { UserStore } from '../../../../stores/user.store';
import { ContactVerificationComponent } from '../../../components/contact-verification/contact-verification.component';
import { EmailVerificationComponent } from '../../../components/email-verification/email-verification.component';
import { PolicyComponent } from '../../../modals/policy/policy.component';
import { SignupStore } from './store/signup.store';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrl: './sign-up.page.css',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    Checkbox,
    ContactVerificationComponent,
    EmailVerificationComponent,
  ],
})
export default class SignUpPage {
  readonly userService = inject(UserService);
  readonly oauthService = inject(OAuthService);
  readonly localStorageService = inject(LocalStorageService);
  readonly toastService = inject(ToastService);
  readonly modalService = inject(ModalService);
  readonly router = inject(Router);
  readonly signupStore = inject(SignupStore);
  readonly userStore = inject(UserStore);
  private readonly policyService = inject(PolicyService);

  private readonly REDIRECT_URL = '/login';

  showPassword = false;
  showPasswordConfirm = false;

  oAuthCreateDto = this.signupStore.oAuthCreateDto;
  token = this.signupStore.token;

  contact = signal<string>('');

  provider = signal('');

  agreementAll = signal(false);
  agreementTerm1 = signal(false);
  agreementTerm2 = signal(false);

  policy = Policy;

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    contact: new FormControl('', [
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(11),
    ]),
    contactCode: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    emailCode: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    emailConsent: new FormControl(false),
    smsConsent: new FormControl(false),
  });

  constructor() {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { provider?: AuthProvider };
    this.provider.set(state?.provider || '');

    afterNextRender(() => {
      this.initializeForm();
    });
  }

  allAgreement(bool: boolean): void {
    this.agreementAll.set(bool);
    this.agreementTerm1.set(bool);
    this.agreementTerm2.set(bool);
  }

  toggleAgreement(term: string, checked: boolean | undefined): void {
    const isChecked = !!checked;

    switch (term) {
      case Policy.USE:
        this.agreementTerm1.set(isChecked);
        break;
      case Policy.PRIVACY:
        this.agreementTerm2.set(isChecked);
        break;
      default:
        break;
    }

    if (this.agreementTerm1() && this.agreementTerm2()) {
      this.agreementAll.set(true);
    } else {
      this.agreementAll.set(false);
    }
  }

  openTerms() {
    this.policyService
      .policyControllerFindByTitle({ title: '이용약관' })
      .subscribe({
        next: (res) => {
          this.modalService.create(PolicyComponent, {
            componentProps: {
              title: res.title,
              content: res.content,
            },
          });
        },
        error: (err) => {
          console.error('Error fetching terms:', err);
        },
      });
  }

  openPrivacyPolicy() {
    this.policyService
      .policyControllerFindByTitle({ title: '개인정보처리방침' })
      .subscribe({
        next: (res) => {
          this.modalService.create(PolicyComponent, {
            componentProps: {
              title: res.title,
              content: res.content,
            },
          });
        },
        error: (err) => {
          console.error('Error fetching terms:', err);
        },
      });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  togglePasswordConfirmVisibility() {
    this.showPasswordConfirm = !this.showPasswordConfirm;
  }

  /**
   * @name submit
   * @description 회원가입
   * @param {Event} event
   * @returns {void}
   */
  submit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.oAuthCreateDto()) {
      this.handleSignupWithSNS();
    } else {
      this.handleSignupWithEmail();
    }
  }

  /**
   * @name handleSignupWithEmail
   * @description 이메일 회원가입
   * @returns {void}
   */
  handleSignupWithEmail(): void {
    const body: CreateUserDto = {
      name: this.form.value.name || '',
      contact: this.form.value.contact || '',
      email: this.form.value.email || '',
      password: this.form.value.password || '',
      confirmPassword: this.form.value.confirmPassword || '',
      emailConsent: this.form.value.emailConsent || false,
      smsConsent: this.form.value.smsConsent || false,
    };

    this.userService.userControllerCreate({ body }).subscribe({
      next: (user: UserDto) => {
        this.localStorageService.set(ACCESS_TOKEN_KEY, user.accessToken);
        this.toastService.success('회원가입이 완료되었습니다.');
        this.router.navigate([this.REDIRECT_URL], {
          state: {
            email: this.form.getRawValue().email,
          },
        });
      },
      error: (error) => {
        const msg = error.error?.message || '';
        if (!msg) return;
        this.toastService.error(msg);
      },
    });
  }

  /**
   * @name navigateToLogin
   * @description 로그인 페이지로 이동합니다.
   * @returns {void}
   */
  private navigateToLogin(): void {
    this.router.navigate([this.REDIRECT_URL], { replaceUrl: true });
  }

  /**
   * @name handleSignupWithSNS
   * @description SNS 회원가입 처리
   * @returns {Promise<void>}
   */
  async handleSignupWithSNS(): Promise<void> {
    const body: CreateUserDto = this.getFormData();
    const accessToken = await this.checkExistingAccount();

    if (accessToken) {
      await this.handleExistingAccountForSNS(accessToken, body);
    } else {
      await this.createNewSNSAccount(body);
    }
  }

  /**
   * @name handleExistingAccountForSNS
   * @description SNS 기존 계정 처리
   * @param {string} accessToken - 액세스 토큰
   * @param {CreateUserDto} body - 회원가입 데이터
   * @returns {Promise<void>}
   */
  private async handleExistingAccountForSNS(
    accessToken: string,
    body: CreateUserDto,
  ): Promise<void> {
    const user = await this.setAccessTokenAndFetchUser(accessToken);
    if (!user) {
      return;
    }

    this.handleAccountConnection(body);
  }

  /**
   * @name handleAccountConnection
   * @description 계정 연결 표시 및 연결 처리
   * @param {CreateUserDto} body - 회원가입 데이터
   * @returns {void}
   */
  private handleAccountConnection(body: CreateUserDto): void {
    this.connectOAuthAccount(body);
  }

  /**
   * @name connectOAuthAccount
   * @description SNS 계정 연결 처리
   * @param {CreateUserDto} body - 회원가입 데이터
   * @returns {void}
   */
  private connectOAuthAccount(body: CreateUserDto): void {
    const params: OauthControllerConnect$Params = {
      body: {
        oAuth: body.oAuth!,
        token: this.token()!,
      },
    };

    this.oauthService.oauthControllerConnect(params).subscribe({
      next: async () => {
        await this.userStore.fetch();
        this.toastService.success('계정이 연결되었습니다.');
        this.navigateToLogin();
      },
      error: (err) => {
        this.toastService.error(err.message);
      },
    });
  }

  /**
   * @name setAccessTokenAndFetchUser
   * @description 액세스 토큰 저장 및 사용자 정보 조회
   * @param {string} accessToken - 액세스 토큰
   * @returns {Promise<UserDto | null>}
   */
  private async setAccessTokenAndFetchUser(
    accessToken: string,
  ): Promise<UserDto | null> {
    this.localStorageService.set(ACCESS_TOKEN_KEY, accessToken);
    const user = await this.userStore.fetch();
    return user;
  }

  /**
   * @name createNewSNSAccount
   * @description SNS 신규 계정 생성
   * @param {CreateUserDto} body - 회원가입 데이터
   * @returns {Promise<void>}
   */
  private async createNewSNSAccount(body: CreateUserDto): Promise<void> {
    const params: UserControllerSignUpWithSns$Params = {
      body,
      token: this.token()!,
    };

    this.userService.userControllerSignUpWithSns(params).subscribe({
      next: (user: UserDto) => {
        this.handleSignupSuccess(user);
      },
      error: (err) => {
        this.handleError(err);
      },
    });
  }

  /**
   * @name handleSignupSuccess
   * @description 회원가입 성공 처리 및 리다이렉트
   * @param {UserDto} user - 회원 정보
   * @returns {void}
   */
  private handleSignupSuccess(user: UserDto): void {
    this.localStorageService.set(ACCESS_TOKEN_KEY, user.accessToken);
    this.toastService.success('회원가입이 완료되었습니다.');
    this.router.navigate([this.REDIRECT_URL]);
  }

  /**
   * @name handleError
   * @description 에러 처리 및 토스트 출력
   * @param {any} error - 에러 객체
   * @returns {void}
   */
  private handleError(error: any): void {
    this.toastService.error(error.message);
  }

  /**
   * @name checkExistingAccount
   * @description 기존 계정 존재 여부를 확인합니다. (이메일 기준)
   * @returns {Promise<string | undefined>}
   */
  private async checkExistingAccount() {
    try {
      const result: TokenDto = await lastValueFrom(
        this.userService.userControllerGetAccessTokenByEmail({
          email: this.form.getRawValue()?.email,
        } as UserControllerGetAccessTokenByEmail$Params),
      );

      return result?.accessToken;
    } catch (err) {
      return undefined;
    }
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

  /**
   * @name getFormData
   * @description 폼 데이터를 UserCreateDto 형태로 반환합니다.
   * @returns {CreateUserDto}
   */
  private getFormData(): CreateUserDto {
    let oAuth = this.getOAuthDto();

    if (!oAuth) {
      oAuth = {
        provider: AuthProvider.EMAIL,
        providerId: undefined,
        email: this.form.getRawValue().email || '',
      };
    }

    const data: CreateUserDto = {
      name: this.form.value.name || '',
      contact: this.sanitizeContact(this.form.getRawValue()?.contact || ''),
      email: this.form.value.email || '',
      password: this.form.value.password || '',
      confirmPassword: this.form.value.confirmPassword || '',
      emailConsent: this.form.value.emailConsent || false,
      smsConsent: this.form.value.smsConsent || false,
      oAuth,
    };
    return data;
  }

  /**
   * @name getOAuthDto
   * @description oAuth 정보를 반환합니다.
   * @returns {OauthCreateDto | undefined}
   */
  private getOAuthDto(): OauthCreateDto | undefined {
    const oAuthData = this.oAuthCreateDto();
    if (!oAuthData) {
      return undefined;
    }
    const dto = {
      provider: oAuthData.signUp?.provider,
      email: oAuthData.signUp?.email,
    } as OauthCreateDto;
    return dto;
  }

  /**
   * @name initializeForm
   * @description 폼 초기화 및 SNS 회원가입 시 비밀번호 검증 비활성화 처리.
   * @returns {void}
   */
  private initializeForm(): void {
    const isSNS = !!this.oAuthCreateDto();

    if (isSNS) {
      // SNS 회원가입일 경우: 이메일 자동 입력, 비밀번호 필수 제거
      this.form
        .get('email')
        ?.setValue(this.oAuthCreateDto()?.signUp?.email || '');
      this.form.get('password')?.clearValidators();
      this.form.get('confirmPassword')?.clearValidators();
    } else {
      // 일반 회원가입일 경우: 비밀번호 필수
      this.form
        .get('password')
        ?.setValidators([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ]);
      this.form
        .get('confirmPassword')
        ?.setValidators([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ]);
    }

    // validator 변경 후 update
    this.form.get('password')?.updateValueAndValidity();
    this.form.get('confirmPassword')?.updateValueAndValidity();
  }

  goBack() {
    this.router.navigate(['/login']);
    this.signupStore.clear();
  }
}
