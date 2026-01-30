/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @angular-eslint/component-class-suffix */
import { CommonModule } from '@angular/common';
import { Component, computed, inject, model, resource } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NoticeDto, NoticeService } from '@api-client';
import {
  AlertService,
  Align,
  ColumnDefinition,
  GridOptions,
  ServerSidePaginationDataGrid,
  ToastService,
} from '@client-libs';
import { toObservableSignal } from 'ngxtension/to-observable-signal';
import { filter, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-notice',
  imports: [CommonModule, ServerSidePaginationDataGrid, RouterLink],
  templateUrl: './notice.page.html',
})
export default class NoticePage {
  readonly noticeService = inject(NoticeService);
  readonly router = inject(Router);
  readonly alertService = inject(AlertService);
  readonly toastService = inject(ToastService);

  pageNo = model(1);
  pageSize = model(10);
  orderBy = model('createdAt');
  align = model<Align>('desc');
  query = model('');

  searchOptions = toObservableSignal(
    computed(() => ({
      pageNo: this.pageNo(),
      pageSize: this.pageSize(),
      query: this.query(),
      orderBy: this.orderBy(),
      align: this.align(),
    })),
  );

  $res = resource({
    stream: ({ request }) =>
      lastValueFrom(
        this.noticeService.noticeControllerSearchV1({
          ...request,
        }),
      ),
    request: () => ({
      pageNo: this.pageNo(),
      pageSize: this.pageSize(),
      query: this.query(),
      align: this.align(),
      orderBy: this.orderBy(),
    }),
  });

  data = this.$res.value;
  items = computed(() => this.data()?.items || []);
  pageInfo = computed(() => this.data()?.pageInfo || {});

  cols: ColumnDefinition[] = [
    {
      type: 'text',
      field: 'rowNumber',
      name: '순번',
    },
    {
      type: 'boolean',
      field: 'isPinned',
      name: '상단 고정',
      badgeProps: {
        true: { color: 'primary', text: '고정' },
        false: { color: 'neutral', text: '미고정' },
      },
    },
    {
      type: 'text',
      field: 'title',
      name: '제목',
      style: {
        cellClass: 'truncate max-w-[60rem]',
      },
    },
    {
      type: 'date',
      field: 'createdAt',
      name: '등록일자',
      format: 'YYYY-MM-DD',
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
    handleQueryParams: true,
    row: {
      clickHandler: (row: NoticeDto) => {
        this.router.navigate(['/customer/notice', row.id]);
      },
      options: [
        {
          label: '수정',
          handler: (row: NoticeDto) =>
            this.router.navigate(['/customer/notice/form'], {
              queryParams: { id: row.id },
            }),
        },
        {
          label: '삭제',
          handler: (row: NoticeDto) => this.handleDelete(row.id),
        },
      ],
    },
  };

  /**
   * @name handleDelete
   * @description 공지사항 삭제
   * @param {string} id
   * @returns {void}
   */
  handleDelete(id: string): void {
    this.alertService
      .open({
        type: 'error',
        title: '공지사항 삭제',
        content: `공지사항을 삭제하시겠습니까?
          삭제되며 삭제 후에는 복구할 수 없습니다.`,
      })
      .closed.pipe(filter((result) => result?.action === 'confirm'))
      .subscribe({
        next: () => {
          this.noticeService.noticeControllerDeleteV1({ id }).subscribe({
            next: () => {
              this.toastService.success('공지사항이 삭제되었습니다.');
              setTimeout(() => {
                this.$res.reload();
              });
            },
          });
        },
      });
  }
}
