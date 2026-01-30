import {
  Component,
  computed,
  inject,
  linkedSignal,
  model,
  signal,
} from '@angular/core';
import { rxResource, toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { OffsetPaginationDto, PageInfoDto, UserService } from '@api-client';
import {
  AlertService,
  Align,
  ColumnDefinition,
  GridOptions,
  Segment,
  SegmentOption,
  ServerSidePaginationDataGrid,
  ToastService,
  ModalService,
} from '@client-libs';
import { UserStatusTarget } from '@common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.css'],
  imports: [ServerSidePaginationDataGrid, Segment],
})
export default class UserPage {
  private readonly userService = inject(UserService);
  private readonly alert = inject(AlertService);
  private readonly toast = inject(ToastService);

  readonly router = inject(Router);
  readonly modalService = inject(ModalService);

  // Pagination / Query / Sort Signal
  page = model(1);
  pageSize = model(10);
  query = model('');
  orderBy = model('createdAt');
  align = model<Align>('desc');

  // Segment Signal
  targetType = signal<UserStatusTarget>('ALL');
  segmentOptions: SegmentOption[] = [
    { label: UserStatusTarget.ALL, value: 'ALL' },
    { label: UserStatusTarget.ACTIVE, value: 'ACTIVE' },
    { label: UserStatusTarget.BLOCKED, value: 'BLOCKED' },
    { label: UserStatusTarget.WITHDRAWN, value: 'WITHDRAWN' },
  ];

  // 검색 옵션
  searchOptions = linkedSignal(() => ({
    pageNo: this.page(),
    pageSize: this.pageSize(),
    query: this.query(),
    orderBy: this.orderBy(),
    align: this.align(),
    targetType: this.targetType(),
  }));
  searchOptions$ = toObservable(this.searchOptions);

  // 서버 응답
  response = rxResource<OffsetPaginationDto, any>({
    params: () => this.searchOptions(),
    stream: ({ params }) => this.fetchItems(params),
  });

  items = computed(() =>
    (this.response.value()?.items ?? []).map((row: any) => ({
      ...row,
      email: row.email ?? row.auths?.[0]?.email,
    })),
  );

  pageInfo = computed<PageInfoDto | undefined>(
    () => this.response.value()?.pageInfo || undefined,
  );

  // 데이터 fetch
  fetchItems(request: any): Observable<OffsetPaginationDto> {
    return this.userService.userControllerSearch({
      ...request,
      targetType: this.targetType(),
    });
  }

  // 테이블 옵션
  options: GridOptions = {
    view: 'table',
    rowNumber: true,
    row: {
      clickHandler: (row: any) => {
        this.router.navigate(['user', row.id]);
      },
      options: [
        {
          label: '차단 / 해제',
          icon: 'mdi:block-helper',
          handler: (row: any) => {
            this.alert
              .open({
                title: `사용자 차단 / 해제`,
                content: `해당 사용자의 차단 상태를 변경하시겠습니까?`,
                buttons: {
                  confirm: { text: '확인' },
                  cancel: { text: '취소' },
                },
                type: 'info',
              })
              .closed.subscribe((result) => {
                if (result?.action === 'confirm') {
                  this.userService
                    .userControllerToggleBlock({ id: row.id })
                    .subscribe({
                      next: () => {
                        this.toast.success('사용자 상태가 변경되었습니다.');
                        this.response.reload();
                      },
                      error: (error) => {
                        console.error(
                          'Error toggling user block status:',
                          error,
                        );
                      },
                    });
                }
              });
          },
        },
      ],
    },
  };

  // 컬럼 정의
  columns: ColumnDefinition[] = [
    { field: 'name', name: '이름', type: 'text' },
    { field: 'email', name: '이메일', type: 'text' },
    { field: 'contact', name: '연락처', type: 'text' },
    {
      name: '상태',
      field: 'status',
      type: 'enum',
      badgeProps: {
        ACTIVE: { color: 'success', text: '정상' },
        BLOCKED: { color: 'warning', text: '차단' },
        WITHDRAWN: { color: 'warning', text: '탈퇴' },
      },
    },
    { field: 'createdAt', name: '가입일시', type: 'date' },
  ];
}
