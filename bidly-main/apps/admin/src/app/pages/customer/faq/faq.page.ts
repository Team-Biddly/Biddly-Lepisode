import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FaqDto, FaqService, PageInfoDto } from '@api-client';
import {
  AlertService,
  ColumnDefinition,
  DataGridSearchOptions,
  GridOptions,
  ServerSidePaginationDataGrid,
  ToastService,
} from '@client-libs';
import { tap } from 'rxjs';

@Component({
  selector: 'app-faq',
  imports: [CommonModule, ServerSidePaginationDataGrid, RouterLink],
  templateUrl: './faq.page.html',
  styleUrl: './faq.page.css',
})
export default class FaqPage {
  readonly faqService = inject(FaqService);
  readonly alertService = inject(AlertService);
  readonly toastService = inject(ToastService);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);

  searchOption = signal<DataGridSearchOptions>({
    pageNo: 1,
    pageSize: 10,
    query: '',
    align: 'desc',
    orderBy: 'createdAt',
  });
  pageInfo = signal<PageInfoDto | null>(null);

  $faqs = rxResource({
    request: () => ({ ...this.searchOption() }),
    stream: ({ request }) =>
      this.faqService.faqControllerSearchV1({ ...request }).pipe(
        tap((res) => {
          this.pageInfo.set(res.pageInfo ?? {});
        }),
      ),
  });

  faqs = computed(() => this.$faqs.value()?.items || []);

  gridOptions: GridOptions = {
    view: 'table',
    column: { sticky: false },
    handleQueryParams: true,
    rowNumber: true,
    searchOption: { disablePagination: false, debounce: 300 },
    row: {
      clickHandler: (row: FaqDto) => {
        this.router.navigate(['/customer/faq', row.id], { replaceUrl: true });
      },
      options: [
        {
          label: '수정',
          handler: (row: FaqDto) => {
            this.router.navigate(['/customer/faq/form'], {
              queryParams: { id: row.id },
              replaceUrl: true,
            });
          },
        },
        {
          label: '삭제',
          handler: (row: FaqDto) => {
            this.alertService
              .open({
                title: '삭제',
                content: 'FAQ를 삭제하시겠습니까?',
                buttons: {
                  confirm: { text: '삭제' },
                  cancel: { text: '취소' },
                },
                type: 'error',
              })
              .closed.subscribe((result) => {
                if (result?.action === 'confirm') {
                  this.faqService
                    .faqControllerDeleteV1({ id: row.id })
                    .subscribe(() => {
                      this.toastService.success('FAQ가 삭제되었습니다.');
                      this.$faqs.reload();
                    });
                }
              });
          },
        },
      ],
    },
  };

  cols: ColumnDefinition[] = [
    {
      type: 'boolean',
      field: 'public',
      name: '상태',
      badgeProps: {
        true: { color: 'info', text: '노출' },
        false: { color: 'neutral', text: '숨김' },
      },
    },
    {
      type: 'text',
      field: 'question',
      name: '질문',
      style: { cellClass: 'truncate max-w-[50rem]' },
    },
    { type: 'text', field: 'admin.name', alias: 'admin.name', name: '작성자' },
    {
      type: 'date',
      field: 'createdAt',
      name: '등록일시',
      format: 'YYYY-MM-DD HH:mm',
    },
  ];
}
