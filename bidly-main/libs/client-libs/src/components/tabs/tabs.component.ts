import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, input, model } from '@angular/core';
import { BaseConfig } from '../common/config/config.adapter';
import { Icon } from '../icon/icon.component';

export type TabOption = {
  label: string | number;
  value: string;
  icon?: string;
  count?: number;
};

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
  standalone: true,
  imports: [CommonModule, Icon],
})
export class Tabs extends BaseConfig implements OnInit {
  value = model<string>('');
  $options = input<string[] | TabOption[]>([], { alias: 'options' });

  options = computed<TabOption[]>(() => {
    if (this.$options().length === 0) return [];

    return this.$options().map((option) => {
      if (typeof option === 'string') {
        return {
          label: option,
          value: option,
        };
      }

      return option;
    });
  });

  ngOnInit(): void {
    if (!this.value()) {
      this.value.set(this.options()[0]?.value);
    }
  }
}
