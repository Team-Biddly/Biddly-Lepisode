import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SignedUpUserChartComponent } from '../../dashboard/signup-user-chart/signup-user-chart.component';

@Component({
  selector: 'app-total-visit-page',
  templateUrl: './total-visit.page.html',
  imports: [CommonModule, SignedUpUserChartComponent],
})
export default class TotalVisitPage {}
