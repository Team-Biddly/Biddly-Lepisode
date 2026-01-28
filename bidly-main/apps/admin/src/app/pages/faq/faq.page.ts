/* eslint-disable @angular-eslint/component-class-suffix */
import {
  Component,
  computed,
  inject,
  model,
  ResourceRef,
  Signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AlertService,
  Align,
  ColumnDefinition,
  GridOptions,
  ServerSidePaginationDataGrid,
  ToastService,
} from '@client-libs';
import { FaqDto, FaqSearchResponseDto, FaqService } from '@api-client';
import { Router, RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-faq',
  imports: [CommonModule, ServerSidePaginationDataGrid, RouterLink],
  templateUrl: './faq.page.html',
  styleUrl: './faq.page.css',
})
export default class FaqPage {
  readonly faqService = inject(FaqService);
  readonly router = inject(Router);
  readonly alertService = inject(AlertService);
  readonly toastService = inject(ToastService);

  pageNo = model<number>(1);
  pageSize = model<number>(10);
  orderBy = model<string>('createdAt');
  align = model<Align>('desc');
  query = model<string>('');

  faq$: ResourceRef<FaqSearchResponseDto | undefined> = rxResource({
    stream: () =>
      this.faqService
        .faqControllerSearchV1({
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

  faq: Signal<FaqSearchResponseDto | undefined> = computed<
    FaqSearchResponseDto | undefined
  >(() => this.faq$.value());

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
    row: {
      clickHandler: (row: FaqDto) => {
        this.router.navigate(['/faq', row.id]);
      },
      options: [
        {
          label: '수정',
          handler: (row: FaqDto) =>
            this.router.navigate(['/faq/update', row.id]),
        },
        // {
        //   label: '삭제',
        //   handler: (row: FaqDto) => this.handleDelete(row),
        // },
      ],
    },
  };

  // /**
  //  * @name handleDelete
  //  * @description FAQ 삭제
  //  * @param {string} id
  //  * @returns {void}
  //  */

  // handleDelete(faq: FaqDto): void {
  //   this.alertService
  //     .open({
  //       icon: 'danger',
  //       title: 'FAQ 삭제',
  //       message: `FAQ를 삭제하시겠습니까? </br>
  //         삭제되며 삭제 후에는 복구할 수 없습니다.`,
  //       content: {
  //         제목: faq.title,
  //         등록일: `${dayjs(faq!.createdAt).format('YYYY-MM-DD HH:mm ')}`,
  //       },
  //       button: { label: '삭제' },
  //     })
  //     .closed.pipe(filter((result) => result?.role === 'confirm'))
  //     .subscribe({
  //       next: () => {
  //         this.faqService.faqControllerDeleteV1({ id: faq.id }).subscribe({
  //           next: () => {
  //             this.toastService.success('FAQ가 삭제되었습니다.');
  //             setTimeout(() => {
  //               this.faq$.reload();
  //             });
  //           },
  //           error: (err) => {
  //             this.toastService.error(err.message);
  //           },
  //         });
  //       },
  //     });
  // }
}
