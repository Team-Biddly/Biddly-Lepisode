import { CommonModule } from '@angular/common';
import { Component, computed, inject, model, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {
  Align,
  ColumnDefinition,
  GridOptions,
  Segment,
  SegmentOption,
  ServerSidePaginationDataGrid,
} from '@client-libs';
import { StatisticsStore } from './statistics.store';
import { toObservableSignal } from 'ngxtension/to-observable-signal';

type SegmentValue =
  | 'total-visit'
  | 'popular-page'
  | 'incoming-page'
  | 'device-type';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.layout.html',
  standalone: true,
  imports: [CommonModule, Segment, RouterOutlet, ServerSidePaginationDataGrid],
  providers: [StatisticsStore],
})
export class StatisticsLayout implements OnInit {
  readonly router = inject(Router);
  readonly statisticsStore = inject(StatisticsStore);

  segmentOptions: SegmentOption[] = [
    { label: '총 방문자 수', value: 'total-visit' },
    { label: '인기 페이지', value: 'popular-page' },
    { label: '유입 페이지', value: 'incoming-page' },
    { label: '디바이스 유형', value: 'device-type' },
  ];
  segment = model<SegmentValue>('total-visit');

  columns: ColumnDefinition[] = [
    { type: 'text', field: 'ip', name: 'IP 주소' },
    { type: 'text', field: 'pageUrl', name: '접속 페이지' },
    { type: 'text', field: 'referrer', name: '방문 경로' },
    { type: 'text', field: 'nation', name: '국가' },
    { type: 'text', field: 'city', name: '도시' },
    {
      type: 'enum',
      field: 'os',
      name: '운영체제',

      badgeProps: {
        Windows: { color: 'primary', text: 'Windows' },
        mac: { color: 'info', text: 'Mac' },
        Android: { color: 'success', text: 'Android' },
        iOS: { color: 'error', text: 'IOS' },
        Linux: { color: 'neutral', text: 'Linux' },
      },
    },
    {
      type: 'text',
      field: 'device',
      name: '기기',
      formatter: (value) => (value === 'desktop' ? 'PC' : '모바일'),
    },
    { type: 'text', field: 'browser', name: '브라우저' },
    {
      type: 'date',
      field: 'createdAt',
      name: '방문일시',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  ];

  gridOptions: GridOptions = {
    view: 'table',
    rowNumber: true,
    badge: {
      variant: 'soft',
    },
  };

  pageNo = model<number>(1);
  pageSize = model<number>(10);
  align = model<Align>('desc');
  orderBy = model<string>('createdAt');
  query = model<string>('');

  searchOption = toObservableSignal(
    computed(() => ({
      pageNo: this.pageNo(),
      pageSize: this.pageSize(),
      align: this.align(),
      orderBy: this.orderBy(),
      query: this.query(),
    })),
  );

  items = this.statisticsStore.items;
  pageInfo = this.statisticsStore.pageInfo;

  startAt = this.statisticsStore.startAt;
  endAt = this.statisticsStore.endAt;

  ngOnInit(): void {
    this.segment.set(this.router.url.split('/')[2] as SegmentValue);

    this.searchOption.subscribe((searchOption) => {
      this.statisticsStore.setSearchOption(searchOption);
    });
  }

  handleSegmentChange() {
    this.router.navigate(['/statistics', this.segment()]);
    this.statisticsStore.reset();
  }
}
