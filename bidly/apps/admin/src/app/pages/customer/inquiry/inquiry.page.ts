import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { InquiryDto, InquiryService, OffsetPaginationDto } from '@api-client';
import {
  AlertService,
  ColumnDefinition,
  DataGridSearchOptions,
  GridOptions,
  ServerSidePaginationDataGrid,
  ToastService,
} from '@client-libs';
import { InquiryControllerSearchV1$Params } from 'libs/api-client/src/lib/fn/inquiry/inquiry-controller-search-v-1';
import { derivedAsync } from 'ngxtension/derived-async';
import { BehaviorSubject, filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-inquiry',
  imports: [CommonModule, ServerSidePaginationDataGrid],
  templateUrl: './inquiry.page.html',
})
export default class InquiryPage {
  inquiryService = inject(InquiryService);
  alertService = inject(AlertService);
  toastService = inject(ToastService);
  router = inject(Router);

  cols: ColumnDefinition[] = [
    {
      type: 'text',
      field: 'rowNumber',
      name: '순번',
    },
    {
      type: 'boolean',
      field: 'isAnswered',
      name: '상태',
      badgeProps: {
        true: { color: 'primary', text: '답변 완료' },
        false: { color: 'neutral', text: '답변 대기' },
      },
    },
    {
      type: 'text',
      field: 'title',
      name: '제목',
      style: {
        cellClass: 'max-w-[50rem] truncate',
      },
    },
    {
      type: 'text',
      field: 'user.name',
      name: '작성자',
      filter: {
        disabled: true,
      },
      style: {
        cellClass: 'text-blue-500 underline underline-offset-4',
      },
      cellClickHandler: (row: InquiryDto) => {
        this.router.navigate(['/user', row?.user?.id]);
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
    row: {
      clickHandler: (row: InquiryDto) => {
        this.router.navigate(['/inquiry', row.id]);
      },
      options: [
        {
          label: '수정',
          handler: (row: InquiryDto) =>
            this.router.navigate(['/inquiry/update', row.id]),
          icon: 'mdi:edit',
        },
        {
          label: '삭제',
          handler: (row: InquiryDto) => this.handleDelete(row.id),
          icon: 'mdi:delete',
        },
      ],
    },
  };

  refresh$ = new BehaviorSubject<DataGridSearchOptions>({
    pageNo: 1,
    pageSize: 10,
    orderBy: 'createdAt',
    align: 'desc',
    query: '',
  });

  /**
   * @name data
   * @description 1:1문의 목록 검색 조회
   * @returns {OffsetPaginationDto}
   */
  data = derivedAsync<OffsetPaginationDto>(
    () =>
      this.refresh$.pipe(
        filter((queryParam) => Object.keys(queryParam).length > 0),
        switchMap((queryParams: InquiryControllerSearchV1$Params) =>
          this.inquiryService.inquiryControllerSearchV1(queryParams),
        ),
      ),
    {
      initialValue: {
        items: [],
        pageInfo: {
          pageItems: 0,
          totalItems: 0,
          pageNo: 1,
          pageSize: 10,
          totalPages: 0,
        },
      } as OffsetPaginationDto,
    },
  );

  /**
   * @name handleDelete
   * @type {Method}
   * @description 1:1 문의 삭제
   * @param {string} id
   * @returns {void}
   */
  handleDelete(id: string): void {
    this.alertService
      .open({
        type: 'error',
        title: '1:1 문의 삭제',
        content: `1:1 문의를 삭제하시겠습니까?
            삭제되며 삭제 후에는 복구할 수 없습니다.`,
      })
      .closed.pipe(filter((result) => result?.action === 'confirm'))
      .subscribe({
        next: () => {
          this.inquiryService.inquiryControllerDeleteV1({ id }).subscribe({
            next: () => {
              this.toastService.success('1:1 문의가 삭제되었습니다.');
              setTimeout(() => {
                this.refresh$.next({ ...this.refresh$.value });
              });
            },
          });
        },
      });
  }
}
