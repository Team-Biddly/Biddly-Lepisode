import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  model,
  ResourceRef,
  Signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { AdminDto, AdminSearchResponseDto, AdminService } from '@api-client';
import {
  AlertService,
  Align,
  ColumnDefinition,
  GridOptions,
  ServerSidePaginationDataGrid,
  ToastService,
} from '@client-libs';
import { catchError, filter, of } from 'rxjs';
import { AdminStore } from '../../../stores/admin.store';

@Component({
  selector: 'app-super',
  imports: [CommonModule, ServerSidePaginationDataGrid, RouterLink],
  templateUrl: './super.page.html',
  styleUrl: './super.page.css',
})
export default class SuperPage {
  readonly adminService = inject(AdminService);
  readonly toastService = inject(ToastService);
  readonly alertService = inject(AlertService);
  readonly router = inject(Router);
  readonly adminStore = inject(AdminStore);

  pageNo = model<number>(1);
  pageSize = model<number>(10);
  orderBy = model<string>('createdAt');
  align = model<Align>('desc');
  query = model<string>('');

  constructor() {
    this.adminStore.fetchAdmin();
  }

  admin$: ResourceRef<AdminSearchResponseDto | undefined> = rxResource({
    stream: () =>
      this.adminService
        .adminControllerSearchOffsetV1({
          pageNo: this.pageNo(),
          pageSize: this.pageSize(),
          query: this.query(),
          align: this.align(),
          orderBy: this.orderBy(),
        })
        .pipe(
          catchError((err) => {
            this.toastService.error(err.message);
            return of(undefined);
          }),
        ),
  });

  admin: Signal<AdminSearchResponseDto | undefined> = computed<
    AdminSearchResponseDto | undefined
  >(() => this.admin$.value());

  filteredAdmin = computed(() => {
    const list = this.admin()?.items || [];
    const me = this.adminStore.user();

    return list.filter((item) => item.id !== me?.id);
  });

  cols: ColumnDefinition[] = [
    {
      type: 'text',
      field: 'rowNumber',
      name: '순번',
    },
    {
      type: 'text',
      field: 'name',
      name: '관리자명',
    },
    {
      type: 'text',
      field: 'email',
      name: '이메일',
    },
    {
      type: 'date',
      field: 'createdAt',
      name: '등록일시',
      format: 'YYYY-MM-DD HH:mm',
    },
  ];

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
          label: '수정',
          handler: (row: AdminDto) =>
            this.router.navigate(['/admin/update', row.id]),
        },
        {
          label: '삭제',
          handler: (row: AdminDto) => this.handleDelete(row),
        },
      ],
    },
  };

  /**
   * @name handleDelete
   * @description ADMIN 삭제
   * @param {string} id
   * @returns {void}
   */
  handleDelete(admin: AdminDto): void {
    this.alertService
      .open({
        type: 'warning',
        icon: { name: 'danger' },
        title: 'ADMIN 삭제',
        content: `ADMIN을 삭제하시겠습니까?
          삭제되며 삭제 후에는 복구할 수 없습니다.`,
        buttons: { confirm: { text: '삭제' } },
      })
      .closed.pipe(filter((result) => result?.action === 'confirm'))
      .subscribe({
        next: () => {
          this.adminService
            .adminControllerDeleteV1({ id: admin.id })
            .subscribe({
              next: () => {
                this.toastService.success('ADMIN이 삭제되었습니다.');
                setTimeout(() => {
                  this.admin$.reload();
                });
              },
              error: (err) => {
                this.toastService.error(err.message);
              },
            });
        },
      });
  }
}
