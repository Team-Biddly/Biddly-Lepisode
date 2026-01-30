import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { StatsCardComponent } from './stats-card/stats-card.component';
import { SignedUpUserChartComponent } from './signup-user-chart/signup-user-chart.component';

import { rxResource } from '@angular/core/rxjs-interop';
import { StatisticsService } from '@api-client';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.css'],
  standalone: true,
  imports: [
    CommonModule,
    StatsCardComponent,
    SignedUpUserChartComponent,
    NgApexchartsModule,
  ],
})
export default class DashboardPage {
  readonly statisticService = inject(StatisticsService);

  $statistics = rxResource({
    stream: () => this.statisticService.statisticControllerFindStatistic(),
  });

  statistics = this.$statistics.value;
}
