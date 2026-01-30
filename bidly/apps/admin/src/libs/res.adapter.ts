/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, computed, inject, model, Signal } from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  AlertService,
  Align,
  ColumnDefinition,
  ModalService,
  PageInfo,
  ToastService,
} from '@client-libs';
import { debounceTime, Observable } from 'rxjs';

@Component({
  selector: 'app-base-page',
  template: '',
  standalone: true,
})
export abstract class ResourceAdapter<T> {
  readonly router = inject(Router);
  readonly modalService = inject(ModalService);
  readonly toastService = inject(ToastService);
  readonly alertService = inject(AlertService);

  page = model(1);
  pageSize = model(10);
  query = model('');
  orderBy = model('createdAt');
  align = model<Align>('desc');

  seacrhOptions = computed(() => ({
    pageNo: this.page(),
    pageSize: this.pageSize(),
    query: this.query(),
    orderBy: this.orderBy(),
    align: this.align(),
  }));
  searchOptions$ = toObservable(this.seacrhOptions);

  request = toSignal(this.searchOptions$.pipe(debounceTime(50)));

  response = rxResource<T, any>({
    stream: ({ request }) =>
      request.pageNo && request.pageSize
        ? this.fetchItems(request)
        : this.emptyFetch(),
    request: () => ({
      ...this.request(),
    }),
  });

  abstract items: Signal<any[]>;
  abstract pageInfo: Signal<PageInfo | null>;
  abstract fetchItems(request: any): Observable<T>;
  abstract columns: ColumnDefinition[];

  private emptyFetch(): Observable<any> {
    return new Observable();
  }
}
