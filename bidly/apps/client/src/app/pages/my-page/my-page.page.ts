/* eslint-disable @nx/enforce-module-boundaries */
import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { AlertService, Icon } from '@client-libs';
import { AuthProvider } from '@common';
import { filter } from 'rxjs';
import { UserStore } from '../../../stores/user.store';

@Component({
  selector: 'app-my-page',
  imports: [
    CommonModule,
    Icon,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    RouterModule,
  ],
  templateUrl: './my-page.page.html',
  styleUrl: './my-page.page.css',
})
export default class MyPagePage {
  readonly alertService = inject(AlertService);
  private readonly userStore = inject(UserStore);
  private router = inject(Router);
  private currentUrl = signal(this.router.url);

  isBookMarkTab = computed(() => this.currentUrl().includes('book-mark'));
  email = computed(
    () =>
      this.user()?.auths?.find((auth) => auth.provider === AuthProvider.EMAIL)
        ?.email ||
      this.user()?.auths[0]?.email ||
      '',
  );

  mobileMainTab: 'updateInfo' | 'bookmark' = 'updateInfo';
  mobileSubTab: 'info' | 'password' = 'info';

  user = this.userStore.$user;

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = (event as NavigationEnd).urlAfterRedirects;
        this.currentUrl.set(url);
      });
  }

  logout() {
    this.alertService
      .open({
        title: '로그아웃',
        content: '로그아웃 하시겠습니까?',
        type: 'info',
      })
      .closed.subscribe({
        next: async (result) => {
          if (result?.action === 'confirm') {
            await this.userStore.logout();
            this.router.navigate(['/']);
          }
        },
      });
  }
}
