/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule, Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  BidConstructionDto,
  BidForeignDto,
  BidService,
  BidServiceDto,
  BidThingDto,
} from '@api-client';
import { Icon } from '@client-libs';
import { injectParams } from 'ngxtension/inject-params';
import { tap } from 'rxjs';

@Component({
  selector: 'app-construction-detail',
  imports: [CommonModule, Icon],
  templateUrl: './construction-detail.page.html',
})
export default class ConstructionDetailPage {
  readonly location = inject(Location);
  private readonly bidService = inject(BidService);

  isBookMarked = signal(false);

  id = injectParams('id');

  data$ = rxResource({
    params: () => ({
      id: this.id() || '',
    }),
    stream: ({ params }) =>
      this.bidService.bidControllerFindById(params).pipe(
        tap((res) => {
          console.debug(res);
        }),
      ),
  });
  data = computed(
    () =>
      this.data$.value() as
        | BidServiceDto
        | BidForeignDto
        | BidThingDto
        | BidConstructionDto
        | any,
  );
}
