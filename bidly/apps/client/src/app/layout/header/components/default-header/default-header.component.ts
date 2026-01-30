import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { BusinessInfoService } from '@api-client';
import { AlertService, Icon } from '@client-libs';
import { UserStore } from '../../../../../stores/user.store';

@Component({
  selector: 'app-default-header',
  imports: [CommonModule, Icon, RouterLink],
  templateUrl: './default-header.component.html',
  styleUrl: './default-header.component.css',
})
export class DefaultHeaderComponent {
  private readonly businessInfoService = inject(BusinessInfoService);
  private readonly userStore = inject(UserStore);
  readonly alertService = inject(AlertService);
  readonly router = inject(Router);

  readonly user = this.userStore.$user;

  isMobileMenuOpen = signal(false);

  $data = rxResource({
    stream: () =>
      this.businessInfoService.businessInfoControllerGetBusinessInfo(),
  });
  logoUrl = computed(() => this.$data.value()?.logo?.url || '');

  toggleMobileMenu() {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
  }

  navigateAndClose(path: string, queryParams: any = {}) {
    this.isMobileMenuOpen.set(false);
    this.router.navigate([path], { queryParams });
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
            this.router.navigate(['/login']);
          }
        },
      });
  }
}
