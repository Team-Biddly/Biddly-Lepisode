import { computed, Injectable } from '@angular/core';
import { CreateUserDto, OAuthResponseDto } from '@api-client';
import { BaseStore } from '@client-libs';

type State = {
  oAuthCreateDto: OAuthResponseDto | null;
  userCreateDto: CreateUserDto | null;
  token: string | null;
};

@Injectable({ providedIn: 'root' })
export class SignupStore extends BaseStore<State> {
  public readonly oAuthCreateDto = computed(() => this.state()?.oAuthCreateDto);
  public readonly userCreateDto = computed(() => this.state()?.userCreateDto);
  public readonly token = computed(() => this.state()?.token);

  constructor() {
    super({
      userCreateDto: null,
      oAuthCreateDto: null,
      token: null,
    });
  }

  setOAuthCreateDto(oAuthCreateDto: OAuthResponseDto) {
    this.updateState({
      oAuthCreateDto,
    });
  }

  setUserCreateDto(userCreateDto: CreateUserDto) {
    this.updateState({
      userCreateDto,
    });
  }

  setToken(token: string) {
    this.updateState({
      token,
    });
  }

  clear() {
    this.updateState({
      userCreateDto: null,
      oAuthCreateDto: null,
      token: null,
    });
  }
}
