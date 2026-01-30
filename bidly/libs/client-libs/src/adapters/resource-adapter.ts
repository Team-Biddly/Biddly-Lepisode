import {
  Component,
  computed,
  inject,
  linkedSignal,
  model,
} from '@angular/core';
import { rxResource, toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { OffsetPaginationDto } from '@api-client';
import { Observable } from 'rxjs';
import { Align } from '../components/common/types';
import { ColumnDefinition } from '../components/data-grid/types/colum-definition.type';
import { GridOptions } from '../components/data-grid/types/grid.type';
import { ModalService } from '../services/services';

@Component({
  selector: 'app-res-page',
  template: '',
  standalone: true,
})
export abstract class ResourceAdapter {
  readonly router = inject(Router);
  readonly modalService = inject(ModalService);

  searchOptions = linkedSignal(() => ({
    pageNo: this.page(),
    pageSize: this.pageSize(),
    query: this.query(),
    orderBy: this.orderBy(),
    align: this.align(),
  }));
  searchOptions$ = toObservable(this.searchOptions);

  response = rxResource<OffsetPaginationDto, any>({
    stream: ({ params }) => this.fetchItems(params),
    params: () => this.searchOptions(),
  });

  page = model(1);
  pageSize = model(10);
  query = model('');
  orderBy = model('createdAt');
  align = model<Align>('desc');

  items = computed(() => this.response.value()?.items);
  pageInfo = computed(() => this.response.value()?.pageInfo);
  abstract options: GridOptions;
  abstract fetchItems(request: any): Observable<OffsetPaginationDto>;
  abstract columns: ColumnDefinition[];
}
