import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { BaseConfig } from '../../common/config/config.adapter';
import { Icon } from '../../icon/icon.component';

@Component({
  selector: 'app-menu-option',
  standalone: true,
  imports: [CommonModule, Icon],
  templateUrl: './menu-option.component.html',
  styleUrls: ['./menu-option.component.css'],
})
export class MenuOption extends BaseConfig {
  icon = input<string>();
  active = input<boolean>(false);
  focus = input<boolean>(false);
}
