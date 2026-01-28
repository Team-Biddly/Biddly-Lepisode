import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Icon } from '@client-libs';

@Component({
  selector: 'app-side-menu-item',
  standalone: true,
  imports: [CommonModule, Icon, RouterModule],
  templateUrl: './side-menu-item.component.html',
  styleUrls: ['./side-menu-item.component.css'],
})
export class SideMenuItem {
  active = input<boolean>(false);
  icon = input.required<string>();
}
