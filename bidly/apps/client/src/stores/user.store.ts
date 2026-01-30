import { afterNextRender, computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { UserDto, UserService } from '@api-client';
import { BaseStore, LocalStorageService } from '@client-libs';
import { ACCESS_TOKEN_KEY, LOGIN_TYPE_KEY } from '@common';
import { toObservableSignal } from 'ngxtension/to-observable-signal';
import { lastValueFrom, map, share } from 'rxjs';

type State = {
  user: UserDto | null;
};

@Injectable({ providedIn: 'root' })
export class UserStore extends BaseStore<State> {
  readonly userService = inject(UserService);
  readonly localStorageService = inject(LocalStorageService);
  readonly router = inject(Router);

  user = toSignal(this.state$.pipe(map((state) => state.user)));

  isLogined = computed(() => !!this.user());

  $user = toObservableSignal<UserDto | null>(
    this.state$.pipe(map((state) => state.user)),
  );

  get isEmailUser() {
    return this.localStorageService.get(LOGIN_TYPE_KEY) === 'EMAIL';
  }

  constructor() {
    super({ user: null });
    this.fetch();
  }

  async fetch(): Promise<UserDto> {
    const user: UserDto = await lastValueFrom(
      this.userService.userControllerGetMe().pipe(share()),
    );
    console.debug('user fetched:', user);
    this.setUser(user);
    return user;
  }

  setUser(user: UserDto) {
    this.updateState({ user });
  }

  clearUser() {
    this.updateState({ user: null });
  }

  async logout() {
    this.clearUser();
    this.localStorageService.remove(ACCESS_TOKEN_KEY);
    this.localStorageService.remove(LOGIN_TYPE_KEY);
    this.router.navigate(['/login']);
  }
}
