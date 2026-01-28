/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CommonModule } from '@angular/common';
import { Component, computed, inject, model, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { StatisticsService, VisitorService } from '@api-client';
import { ChartComponent, ChartOptions, DateRange, Icon } from '@client-libs';
import { StatisticsStore } from '../../statistics/statistics.store';
import { StatsCardComponent } from '../stats-card/stats-card.component';
import dayjs from 'dayjs';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-signup-user-chart',
  templateUrl: './signup-user-chart.component.html',
  styleUrls: ['../dashboard.page.css'],
  imports: [
    ChartComponent,
    CommonModule,
    DateRange,
    StatsCardComponent,
    NgApexchartsModule,
    Icon,
  ],
})
export class SignedUpUserChartComponent {
  private readonly statisticService = inject(StatisticsService);

  readonly visitorService = inject(VisitorService);
  readonly statisticsStore = inject(StatisticsStore);

  $data = rxResource({
    params: () => ({
      startAt: this.startAt(),
      endAt: this.endAt(),
    }),
    stream: ({ params }) =>
      this.statisticService.statisticControllerGetSignUpUsersByDate({
        startDate: params.startAt.toISOString(),
        endDate: params.endAt.toISOString(),
      }),
  });

  startAt = signal<Date>(dayjs().subtract(7, 'day').toDate());
  endAt = signal<Date>(dayjs().toDate());

  options = computed<ChartOptions>(() => ({
    tooltip: {
      custom: (data: any) => this.customTooltip(data),
    },
    xaxis: {
      type: 'datetime',
      labels: {
        formatter: (value: string) => dayjs(value).format('YYYY-MM-DD'),
      },
    },
    yaxis: {
      tickAmount: 1,
    },
    chart: {
      type: 'area',
      fontFamily: 'inherit',
      height: 240,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ['#2b7fff'],
    series: [
      {
        name: '가입자 수',
        data: this.$data.value(),
      },
    ],
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
  }));

  todaySignupUsers = computed(() => {
    const data = this.$data.value() ?? [];
    const today = dayjs().startOf('day').valueOf();
    return data.find(([ts]) => dayjs(ts).isSame(today, 'day'))?.[1] ?? 0;
  });

  last3DaysSignupUsers = computed(() => {
    const data = this.$data.value() ?? [];
    const from = dayjs().subtract(2, 'day').startOf('day'); // 오늘 포함 3일
    return data
      .filter(([ts]) => dayjs(ts).isAfter(from.subtract(1, 'day')))
      .reduce((sum, [, count]) => sum + count, 0);
  });

  last7DaysSignupUsers = computed(() => {
    const data = this.$data.value() ?? [];
    const from = dayjs().subtract(6, 'day').startOf('day'); // 오늘 포함 7일
    return data
      .filter(([ts]) => dayjs(ts).isAfter(from.subtract(1, 'day')))
      .reduce((sum, [, count]) => sum + count, 0);
  });

  customTooltip(data: any) {
    const timestamp = this.$data.value()?.[data.dataPointIndex]?.at(0);
    if (!timestamp) {
      return '';
    }
    const { series, seriesIndex, dataPointIndex } = data;

    return `<div class="min-w-[3rem] tooltip-shadow p-2.5 flex flex-col justify-center items-center gap-1">
          <div class="text-gray-800">가입자 수 : ${series[0][dataPointIndex]}명</div>
          <div class="text-gray-500">${dayjs(timestamp).format('YYYY년 MM월 DD일')}</div>
        </div>`;
  }
}
