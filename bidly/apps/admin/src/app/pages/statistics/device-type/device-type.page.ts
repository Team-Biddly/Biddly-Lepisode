import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DeviceTypeComponent } from '../../dashboard/device-type/device-type.component';

@Component({
  selector: 'app-device-type-page',
  templateUrl: './device-type.page.html',
  styleUrls: ['../../dashboard/dashboard.page.css'],
  imports: [CommonModule, DeviceTypeComponent],
})
export default class DeviceTypePage {}
