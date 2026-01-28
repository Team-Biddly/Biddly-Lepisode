import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-menu-item-child',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-menu-item-child.component.html',
  styleUrls: ['./side-menu-item-child.component.css'],
})
export class SideMenuItemChild {
  active = input<boolean>(false);
}
