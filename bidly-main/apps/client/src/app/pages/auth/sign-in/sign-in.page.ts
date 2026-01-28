import { Platform } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { afterNextRender, Component, inject } from '@angular/core';
import { rxResource, toObservable } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  BusinessInfoService,
  GoogleService,
  KakaoService,
  OAuthResponseDto,
  OAuthService,
  TokenDto,
  UserService,
} from '@api-client';
import { LocalStorageService, ModalService, ToastService } from '@client-libs';
import { ACCESS_TOKEN_KEY, LOGIN_TYPE_KEY, UserLoginState } from '@common';
import { AuthProvider } from '@prisma/client';
import { UserControllerSigninWithEmail$Params } from 'libs/api-client/src/lib/fn/user/user-controller-signin-with-email';
import { environment } from '../../../../environments/environment';
import { UserStore } from '../../../../stores/user.store';
// import { ConnectAccountConfirm } from '../../../modals/connect-account-confirm/connect-account-confirm';
import { SignupStore } from '../sign-up/store/signup.store';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrl: './sign-in.page.scss',
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
})
export default class SignInPage {
  private readonly toast = inject(ToastService);
  private readonly userStore = inject(UserStore);
  private readonly router = inject(Router);
  private readonly platform = inject(Platform);
  private readonly modalService = inject(ModalService);
  private readonly toastService = inject(ToastService);
  private readonly userService = inject(UserService);
  private readonly kakaoService = inject(KakaoService);
  private readonly googleService = inject(GoogleService);
  private readonly signupStore = inject(SignupStore);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly oauthService = inject(OAuthService);
  private readonly businessInfoService = inject(BusinessInfoService);

  user = this.userStore.$user;
  user$ = toObservable(this.user);

  loginSuccessRedirectURI = '/';

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  $data = rxResource({
    stream: () =>
      this.businessInfoService.businessInfoControllerGetBusinessInfo(),
  });

  constructor() {
    this.user$.subscribe((user) => {
      if (user && this.router.url !== '/login') {
        this.router.navigate(['/']);
      }
    });

    afterNextRender(() => {
      if (this.platform.isBrowser) {
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        if (code) {
          if (url.pathname.includes('/login/kakao')) {
            this.handleKakaoLoginResponse();
          } else if (url.pathname.includes('/login/google')) {
            this.handleGoogleLoginResponse();
          }
        }
      }
    });
  }

  keydownHandler(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.submit();
    }
  }

  submit() {
    if (this.form.invalid) {
      this.toast.error('아이디 또는 비밀번호를 확인해주세요.');
      return;
    }

    const body = this.form.getRawValue();
  }

  /**
   * @name emailLogin
   * @description 이메일/비밀번호로 로그인 처리
   * @param {Event} [ev] - 이벤트 객체(옵션)
   * @returns {void}
   */
  emailLogin(ev: Event): void {
    ev.preventDefault();
    ev.stopPropagation();

    if (this.form.invalid) {
      this.toastService.error('입력 정보를 확인해 주세요.');
      return;
    }

    this.userService
      .userControllerSigninWithEmail({
        body: {
          email: this.form.getRawValue().email || '',
          password: this.form.getRawValue().password || '',
        },
      } as UserControllerSigninWithEmail$Params)
      .subscribe({
        next: async (token: TokenDto) => {
          this.localStorageService.set(ACCESS_TOKEN_KEY, token.accessToken);
          this.localStorageService.set(LOGIN_TYPE_KEY, 'EMAIL');
          await this.userStore.fetch();
          this.router.navigate([this.loginSuccessRedirectURI]);
        },
        error: (err) => {
          this.toastService.error(err.error.message);
        },
      });
  }

  /**
   * @name kakaoLogin
   * @description 카카오 로그인 버튼 클릭 시 처리
   * @param {Event} [ev] - 이벤트 객체(옵션)
   * @returns {Promise<void>}
   */
  async kakaoLogin(ev?: Event): Promise<void> {
    ev?.preventDefault();
    ev?.stopPropagation();
    this.redirectToKakaoLogin();
  }

  /**
   * @name GoogleLogin
   * @description 구글 로그인 버튼 클릭 시 처리
   * @param {Event} [ev] - 이벤트 객체(옵션)
   * @returns {Promise<void>}
   */
  async googleLogin(ev?: Event): Promise<void> {
    ev?.preventDefault();
    ev?.stopPropagation();
    this.redirectToGoogleLogin();
  }

  /**
   * @name redirectToKakaoLogin
   * @description 카카오 로그인 페이지로 리다이렉트
   * @returns {void}
   */
  private redirectToKakaoLogin(): void {
    const roleParam = {
      provider: AuthProvider.KAKAO,
    };

    const queryParams = new URLSearchParams({
      client_id: environment.kakao.clientId,
      redirect_uri: environment.kakao.redirectUri,
      response_type: 'code',
      state: JSON.stringify(roleParam),
    });

    const loginUrl = `https://kauth.kakao.com/oauth/authorize?${queryParams.toString()}`;
    window.location.href = loginUrl;
  }

  /**
   * @name redirectToGoogleLogin
   * @description 구글 로그인 페이지로 리다이렉트
   * @returns {void}
   */
  private redirectToGoogleLogin(): void {
    const roleParam = {
      provider: AuthProvider.GOOGLE,
    };

    const queryParams = new URLSearchParams({
      client_id: environment.google.clientId,
      redirect_uri: environment.google.redirectUri,
      response_type: 'code',
      state: JSON.stringify(roleParam),
      scope: 'email profile openid',
    });

    const loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${queryParams.toString()}`;
    window.location.href = loginUrl;
  }

  /**
   * @name handleKakaoLoginResponse
   * @description 카카오 로그인 콜백 응답 처리
   * @returns {Promise<void>}
   */
  async handleKakaoLoginResponse(): Promise<void> {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    if (!code) {
      this.toastService.error('카카오 로그인에 실패했습니다.');
      return;
    }

    this.kakaoService.kakaoAuthControllerLogin({ code }).subscribe({
      next: (oauthResponse: OAuthResponseDto) =>
        this.handleOAuthResponse(oauthResponse),
      error: (err) => {
        this.signupStore.clear();
        console.error(err);
      },
    });
  }

  /**
   * @name handleGoogleLoginResponse
   * @description 구글 로그인 콜백 응답 처리
   * @returns {Promise<void>}
   */
  async handleGoogleLoginResponse(): Promise<void> {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    if (!code) {
      this.toastService.error('구글 로그인에 실패했습니다.');
      return;
    }

    this.googleService.googleAuthControllerLogin({ code }).subscribe({
      next: (oauthResponse: OAuthResponseDto) =>
        this.handleOAuthResponse(oauthResponse),
      error: (err) => {
        this.signupStore.clear();
        console.error(err);
      },
    });
  }

  /**
   * @name handleOAuthResponse
   * @description OAuth 응답 상태별 처리
   * @param {OAuthResponseDto} oauthResponse - OAuth 응답 객체
   * @returns {void}
   */
  private handleOAuthResponse(oauthResponse: OAuthResponseDto): void {
    switch (oauthResponse.state) {
      case UserLoginState.회원가입필요:
        this.handleSignupRequired(oauthResponse);
        break;
      case UserLoginState.로그인성공:
        this.handleLoginSuccess(oauthResponse);
        break;
    }
  }

  /**
   * @name handleSignupRequired
   * @description 회원가입이 필요한 경우 처리
   * @param {OAuthResponseDto} oauthResponse - OAuth 응답 객체
   * @returns {void}
   */
  private handleSignupRequired(oauthResponse: OAuthResponseDto): void {
    this.signupStore.setOAuthCreateDto(oauthResponse);
    if (!oauthResponse.token) {
      this.toastService.error('회원가입을 위한 토큰이 필요합니다.');
      return;
    }
    this.signupStore.setToken(oauthResponse.token);
    this.router.navigate(['/user/sign-up'], {
      state: { provider: oauthResponse.signUp?.provider },
    });
  }

  /**
   * @name handleLoginSuccess
   * @description 로그인 성공 시 처리
   * @param {OAuthResponseDto} oauthResponse - OAuth 응답 객체
   * @returns {Promise<void>}
   */
  private async handleLoginSuccess(
    oauthResponse: OAuthResponseDto,
  ): Promise<void> {
    let accessToken: string | undefined;

    const token = oauthResponse.token;

    if (
      token &&
      typeof token === 'object' &&
      'accessToken' in token &&
      typeof (token as any).accessToken === 'string'
    ) {
      accessToken = (token as { accessToken: string }).accessToken;
    }

    this.localStorageService.set(ACCESS_TOKEN_KEY, accessToken);
    this.localStorageService.set(LOGIN_TYPE_KEY, 'SOCIAL');
    await this.userStore.fetch();
    this.router.navigate([this.loginSuccessRedirectURI]);
  }
}
