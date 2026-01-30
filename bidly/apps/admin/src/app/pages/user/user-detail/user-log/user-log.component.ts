import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  model,
} from '@angular/core';
import { rxResource, toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  LogService,
  OffsetPaginationDto,
  PageInfoDto,
  UserDto,
} from '@api-client';
import {
  Accordion,
  Align,
  ColumnDefinition,
  GridOptions,
  ModalService,
  ServerSidePaginationDataGrid,
} from '@client-libs';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-log',
  templateUrl: './user-log.component.html',
  imports: [CommonModule, Accordion, ServerSidePaginationDataGrid],
})
export class UserLogComponent {
  logService = inject(LogService);
  user = input.required<UserDto>();
  readonly router = inject(Router);
  readonly modalService = inject(ModalService);

  reload() {
    this.response.reload();
  }

  searchOptions = linkedSignal(() => ({
    pageNo: this.page(),
    pageSize: this.pageSize(),
    query: this.query(),
    orderBy: this.orderBy(),
    align: this.align(),
  }));
  searchOptions$ = toObservable(this.searchOptions);

  page = model(1);
  pageSize = model(10);
  query = model('');
  orderBy = model('createdAt');
  align = model<Align>('desc');

  options: GridOptions = {
    view: 'table',
    rowNumber: true,
  };

  columns: ColumnDefinition[] = [
    {
      name: '내용',
      field: 'content',
      type: 'text',
    },
    {
      name: '생성일',
      field: 'createdAt',
      type: 'date',
    },
  ];

  // 서버 응답
  response = rxResource<OffsetPaginationDto, any>({
    stream: ({ params }) => this.fetchItems(params),
    params: () => this.searchOptions(),
  });

  items = computed(() => this.response.value()?.items ?? []);

  pageInfo = computed<PageInfoDto | undefined>(
    () => this.response.value()?.pageInfo || undefined,
  );

  fetchItems(request: any): Observable<OffsetPaginationDto> {
    return this.logService.logControllerSearchOffset({
      ...request,
      targetId: this.user()?.id,
      targetModel: 'User',
    });
  }
}
