/* eslint-disable @nx/enforce-module-boundaries */
import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  ResourceRef,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import dayjs from 'dayjs';
import BannerFormPage from './banner-form/banner-form.page';

import { BannerDto, BannerSearchResponseDto, BannerService } from '@api-client';
import {
  AlertService,
  Align,
  ColumnDefinition,
  GridOptions,
  Icon,
  MODAL_CONFIRM,
  ModalService,
  ServerSidePaginationDataGrid,
  ToastService,
} from '@client-libs';
import { Mode } from '@common';
import { BannerControllerDelete$Params } from 'libs/api-client/src/lib/fn/banner/banner-controller-delete';
import { BannerControllerReorder$Params } from 'libs/api-client/src/lib/fn/banner/banner-controller-reorder';
import { BannerControllerSearch$Params } from 'libs/api-client/src/lib/fn/banner/banner-controller-search';
import { NoticeControllerUpdateV1$Params } from 'libs/api-client/src/lib/fn/notice/notice-controller-update-v-1';

@Component({
  selector: 'custom-image-cell',
  template: `
    <img class="size-25 object-contain" [src]="imageSrc()" alt="미리보기" />
  `,
})
export class CustomImageCellComponent {
  row = input<any>();
  column = input<any>();

  imageSrc = computed(() => {
    const field = this.row()[this.column().field];
    if (Array.isArray(field) && field.length > 0) {
      return this.row()?.[this.column().field]?.[0]?.url || '';
    } else {
      return this.row()?.[this.column().field]?.url || '';
    }
  });
}

@Component({
  selector: 'app-banner',
  imports: [CommonModule, ServerSidePaginationDataGrid, Icon],
  templateUrl: './banner.page.html',
})
export default class BannerPage {
  private readonly bannerService = inject(BannerService);
  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);
  private readonly toastService = inject(ToastService);
  private readonly modalService = inject(ModalService);

  pageNo = signal(1);
  pageSize = signal(9999);
  orderBy = signal('createdAt');
  align = signal<Align>('desc');
  query = signal('');
  mode = signal<string>(Mode.PC);

  modeTabs = Object.entries(Mode).map(([key, value]) => ({
    key,
    value,
  }));

  $data: ResourceRef<BannerSearchResponseDto | undefined> = rxResource({
    stream: () =>
      this.bannerService.bannerControllerSearch({
        pageNo: this.pageNo(),
        pageSize: this.pageSize(),
        query: this.query(),
        orderBy: this.orderBy(),
        align: this.align(),
        mode: this.mode(),
      } as BannerControllerSearch$Params),
  });

  cols = computed<ColumnDefinition[]>(() => [
    {
      type: 'text',
      field: 'order',
      name: '순번',
    },
    {
      type: 'enum',
      field: 'isExposed',
      name: '상태',
      badgeProps: {
        true: { color: 'success', text: '노출' },
        false: { color: 'neutral', text: '숨김' },
      },
    },
    {
      type: 'custom',
      field: this.mode() === Mode.PC ? 'pcImage' : 'mobileImage',
      name: '미리보기',
      renderItem: CustomImageCellComponent,
    },
    {
      type: 'text',
      field: 'title',
      name: '제목',
    },
    {
      type: 'text',
      field: 'admin.name',
      name: '작성자',
    },
    {
      type: 'text',
      field: 'createdAt',
      name: '등록일시',
      formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm'),
    },
    {
      type: 'drag-handler',
      field: '',
      name: '',
    },
  ]);

  gridOptions: GridOptions = {
    view: 'table',
    column: {
      sticky: false,
    },
    dragDrop: {
      enable: true,
      handler: (event) => {
        const { previousIndex, currentIndex } = event;

        this.bannerService
          .bannerControllerReorder({
            body: {
              mode: this.mode(),
              current: currentIndex,
              prev: previousIndex,
            },
          } as BannerControllerReorder$Params)
          .subscribe({
            next: () => {
              this.toastService.success('순서가 변경되었습니다.');
              this.$data.reload();
            },
            error: (error) => {
              this.toastService.error(error.message);
            },
          });
      },
    },
    row: {
      options: [
        {
          label: '수정',
          handler: (row: BannerDto) => this.openFormModal(row.id),
          icon: 'mdi:edit',
        },
        {
          label: '삭제',
          handler: (row: BannerDto) => this.handleDelete(row.id),
          icon: 'mdi:delete',
        },
        {
          label: '노출/숨김',
          handler: (row: BannerDto) =>
            this.bannerService
              .bannerControllerUpdate({
                id: row.id,
                body: {
                  ...row,
                  isExposed: !row.isExposed,
                },
              } as NoticeControllerUpdateV1$Params)
              .subscribe({
                next: () => {
                  this.toastService.success(
                    `${row.isExposed ? '숨김' : '노출'} 처리되었습니다.`,
                  );
                  this.$data.reload();
                },
                error: (error) => {
                  this.toastService.error(error.message);
                },
              }),
          icon: 'material-symbols:slideshow-outline',
        },
      ],
    },
  };

  openFormModal(id?: string): void {
    this.modalService
      .create(BannerFormPage, {
        componentProps: {
          id,
          mode: this.mode(),
        },
      })
      .closed.subscribe({
        next: () => {
          this.$data.reload();
        },
      });
  }

  handleDelete(id: string): void {
    this.alertService
      .open({
        title: '배너 삭제',
        content: '해당 배너를 정말로 삭제하시겠습니까?',
        type: 'error',
        buttons: {
          confirm: {
            text: '삭제',
          },
          cancel: {
            text: '취소',
          },
        },
      })
      .closed.subscribe({
        next: async (result) => {
          if (result?.action === MODAL_CONFIRM) {
            if (!id) return;
            this.bannerService
              .bannerControllerDelete({
                id,
              } as BannerControllerDelete$Params)
              .subscribe({
                next: () => {
                  this.toastService.success('배너가 삭제되었습니다.');
                  this.$data.reload();
                },
                error: () => {
                  this.toastService.error('배너 삭제에 실패했습니다.');
                },
              });
          }
        },
      });
  }
}
