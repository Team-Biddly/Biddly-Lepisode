import { Component } from '@angular/core';
import { DayAdapter } from '../../adapters/day.adapter';
import dayjs from 'dayjs';
import { CommonModule } from '@angular/common';

dayjs.locale('ko');

@Component({
  selector: 'app-timeline-day',
  templateUrl: './timeline-day.component.html',
  styleUrls: ['./timeline-day.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class TimelineDay extends DayAdapter {}
