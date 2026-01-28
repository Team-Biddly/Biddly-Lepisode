import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Icon } from '@client-libs';

@Component({
  selector: 'app-no-permission',
  templateUrl: './no-permission.page.html',
  imports: [Icon],
})
export default class NotPermissionPage {
  readonly location = inject(Location);
}
