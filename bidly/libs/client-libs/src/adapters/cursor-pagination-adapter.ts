import { Component, inject, linkedSignal, model, Signal } from '@angular/core';
import { rxResource, toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Align } from '../components/common/types';

export type Options =
  | 'pageNo'
  | 'pageSize'
  | 'query'
  | 'orderBy'
  | 'align'
  | 'cursor';

@Component({
  selector: 'app-cursor-page',
  template: '',
  standalone: true,
})
export abstract class CursorAdapter<T> {
  readonly router = inject(Router);

  seacrhOptions = linkedSignal(() => ({
    pageNo: this.page(),
    pageSize: this.pageSize(),
    query: this.query(),
    orderBy: this.orderBy(),
    align: this.align(),
  }));
  searchOptions$ = toObservable(this.seacrhOptions);

  response = rxResource<T, any>({
    stream: ({ params }) => this.fetchItems(params),
    params: () => this.seacrhOptions(),
  });

  page = model(1);
  pageSize = model(9);
  query = model('');
  orderBy = model('createdAt');
  align = model<Align>('desc');
  cursor = model<string | null>(null);

  optionResetHandler(except?: Options[]) {
    if (!except?.includes('pageNo')) {
      this.page.set(1);
    }
    if (!except?.includes('pageSize')) {
      this.pageSize.set(9);
    }
    if (!except?.includes('query')) {
      this.query.set('');
    }
    if (!except?.includes('orderBy')) {
      this.orderBy.set('createdAt');
    }
    if (!except?.includes('align')) {
      this.align.set('desc');
    }
    if (!except?.includes('cursor')) {
      this.cursor.set(null);
    }
  }

  abstract items: Signal<any[]>;
  abstract nextCursor: Signal<string | null>;
  abstract hasNext: Signal<boolean>;
  abstract fetchItems(request: any): Observable<T>;
}
