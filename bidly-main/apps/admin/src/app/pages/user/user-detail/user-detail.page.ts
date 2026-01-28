import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, viewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '@api-client';
import {
  Accordion,
  AlertService,
  Badge,
  Button,
  Icon,
  Menu,
  MenuOption,
  ModalService,
  ToastService,
} from '@client-libs';
import { injectParams } from 'ngxtension/inject-params';
import { of } from 'rxjs';
import { UserLogComponent } from './user-log/user-log.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.css'],
  imports: [
    CommonModule,
    RouterLink,
    Icon,
    Accordion,
    CdkMenuModule,
    Badge,
    Menu,
    MenuOption,
    Button,
    UserLogComponent,
  ],
})
export default class UserDetailPage {
  userService = inject(UserService);
  alertService = inject(AlertService);
  router = inject(Router);
  toastService = inject(ToastService);
  modalService = inject(ModalService);

  private readonly userLogComponent = viewChild.required(UserLogComponent);

  listRoute = '/admin/user';

  isOpen = true;
  id = injectParams('id');

  user$ = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => {
      if (!params.id) return of(null);
      return this.userService.userControllerFindById({ id: params.id });
    },
  });
  user = computed(() => this.user$.value());

  toggleBlock() {
    if (!this.id()) return;
    this.alertService
      .open({
        title: `회원 ${this.user()?.status === 'ACTIVE' ? '차단' : '차단 해제'}`,
        content:
          this.user()?.status === 'ACTIVE'
            ? `해당 회원을 차단하시겠습니까?
        차단 시 해당 계정은 로그인할 수 없게 됩니다.`
            : `해당 회원을 차단 해제하시겠습니까?
        차단 해제 시 해당 계정은 다시 로그인할 수 있습니다.`,
        buttons: {
          confirm: {
            text: this.user()?.status === 'ACTIVE' ? '차단' : '차단 해제',
          },
          cancel: {
            text: '취소',
          },
        },
        type: this.user()?.status === 'ACTIVE' ? 'error' : 'info',
      })
      .closed.subscribe((result) => {
        if (result?.action === 'confirm') {
          this.userService
            .userControllerToggleBlock({ id: this.id()! })
            .subscribe({
              next: () => {
                this.toastService.success('회원의 상태가 변경되었습니다.');
                this.user$.reload();
                this.userLogComponent().reload();
              },
              error: (error) => {
                console.error('Error blocking user:', error);
              },
            });
        }
      });
  }
}
