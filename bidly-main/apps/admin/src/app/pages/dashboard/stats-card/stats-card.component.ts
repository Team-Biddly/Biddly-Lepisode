import { Component, HostBinding, booleanAttribute, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Icon } from '@client-libs';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule, Icon],
  templateUrl: './stats-card.component.html',
})
export class StatsCardComponent {
  @HostBinding('class') class = 'w-full';

  label = input<string>('');
  value = input<number>(0);
  type = input<'text' | 'number'>('text');
  icon = input<string>('ic:baseline-person');
  unit = input<string>('');
  active = input<boolean, string | boolean>(false, {
    transform: booleanAttribute,
  });
}
