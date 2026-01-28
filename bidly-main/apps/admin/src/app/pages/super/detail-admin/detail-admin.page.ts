import {
  Component,
  ResourceRef,
  Signal,
  computed,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AlertService,
  Button,
  GridOptions,
  ModalService,
  ToastService,
  Icon,
  Menu,
  MenuOption,
  MODAL_CONFIRM,
} from '@client-libs';
import { Router, RouterLink } from '@angular/router';
import { AdminDto, AdminService } from '@api-client';
import { catchError, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { injectParams } from 'ngxtension/inject-params';
import { CdkMenuModule } from '@angular/cdk/menu';
import { AdminLogComponent } from './admin-log/admin-log.component';

@Component({
  selector: 'app-detail-admin',
  standalone: true,
  imports: [
    CommonModule,
    Button,
    RouterLink,
    Icon,
    Menu,
    MenuOption,
    CdkMenuModule,
    AdminLogComponent,
  ],
  templateUrl: './detail-admin.page.html',
  styleUrl: './detail-admin.page.css',
})
export default class DetailAdminPage {
  readonly adminService = inject(AdminService);
  readonly toastService = inject(ToastService);
  readonly alertService = inject(AlertService);
  readonly modalService = inject(ModalService);
  readonly router = inject(Router);

  private readonly adminLogComponent = viewChild.required(AdminLogComponent);

  isOpen = true;
  id = injectParams('id');

  admin$: ResourceRef<AdminDto | undefined> = rxResource({
    stream: () =>
      this.adminService.adminControllerFindByIdV1({ id: this.id() || '' }).pipe(
        catchError((err) => {
          this.toastService.error(err.message);
          return of(undefined);
        }),
      ),
  });

  admin: Signal<AdminDto | undefined> = computed(() => this.admin$?.value());

  constructor() {
    effect(() => {
      const current = this.admin();
      console.log('[effect] admin loaded:', current);
    });
  }

  gridOptions: GridOptions = {
    view: 'table',
    column: {
      sticky: false,
    },
    group: {
      groupBy: 'isPinned',
    },
    row: {
      clickHandler: (row: AdminDto) => {
        this.router.navigate(['/admin', row.id]);
      },
      options: [
        {
          label: '차단/해제',
          handler: () => {
            this.toggleBlock();
          },
        },
      ],
    },
  };

  toggleBlock() {
    if (!this.id()) return;
    this.alertService
      .open({
        title: `관리자 ${this.admin()?.status === 'ACTIVE' ? '차단' : '차단 해제'}`,
        content:
          this.admin()?.status === 'ACTIVE'
            ? `해당 관리자를 차단하시겠습니까?
        차단 시 해당 계정은 로그인할 수 없게 됩니다.`
            : `해당 관리자의 차단을 해제하시겠습니까?
        차단 해제 시 해당 계정은 다시 로그인할 수 있습니다.`,
        buttons: {
          confirm: {
            text: this.admin()?.status === 'ACTIVE' ? '차단' : '차단 해제',
          },
          cancel: {
            text: '취소',
          },
        },
        type: this.admin()?.status === 'ACTIVE' ? 'error' : 'info',
      })
      .closed.subscribe((result) => {
        if (result?.action === 'confirm') {
          this.adminService
            .adminControllerToggleBlockV1({ id: this.id()! })
            .subscribe({
              next: () => {
                this.toastService.success('관리자의 상태가 변경되었습니다.');
                this.admin$.reload();
                this.adminLogComponent().reload();
              },
              error: (error) => {
                console.error('Error toggling block status:', error);
              },
            });
        }
      });
  }
}
