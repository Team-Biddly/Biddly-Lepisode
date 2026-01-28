import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, input, viewChild } from '@angular/core';
import {
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTheme,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series?: any;
  nonSeries?: any;
  chart: ApexChart;
  stroke?: ApexStroke;
  labels?: any;
  dataLabels?: ApexDataLabels;
  plotOptions?: ApexPlotOptions;
  yaxis?: ApexYAxis | ApexYAxis[];
  xaxis: ApexXAxis;
  grid?: ApexGrid;
  colors?: string[];
  tooltip?: ApexTooltip;
  title?: ApexTitleSubtitle;
  fill?: ApexFill;
  markers?: ApexMarkers;
  theme?: ApexTheme;
  responsive?: ApexResponsive[];
  legend?: ApexLegend;
  subtitle?: ApexTitleSubtitle;
};

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './chart.component.html',
})
export class ChartComponent {
  options = input.required<ChartOptions>();
}
