import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IncomingPageComponent } from '../../dashboard/incoming-page/incoming-page.component';

@Component({
  selector: 'app-incoming-page-page',
  templateUrl: './incoming-page.page.html',
  styleUrls: ['../../dashboard/dashboard.page.css'],
  imports: [CommonModule, IncomingPageComponent],
})
export default class IncomingPagePage {}
