import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PopularPageComponent } from '../../dashboard/popular-page/popular-page.component';

@Component({
  selector: 'app-popular-page-page',
  styleUrls: ['../../dashboard/dashboard.page.css'],
  templateUrl: './popular-page.page.html',
  imports: [CommonModule, PopularPageComponent],
})
export default class PopularPagePage {}
