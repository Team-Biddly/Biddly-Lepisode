import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Checkbox, Icon } from '@client-libs';
import { FilterStore } from '../../../stores/filter.store';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-filter-panel',
  imports: [CommonModule, Checkbox, Icon, FormsModule],
  templateUrl: './search-filter-panel.component.html',
  styleUrl: './search-filter-panel.component.css',
})
export class SearchFilterPanelComponent {
  readonly filterStore = inject(FilterStore);
  readonly router = inject(Router);

  isAdvancedSearchTab = input<boolean>();
  tabChange = output<boolean>();
  url = signal(this.router.url.split('?')[0].split('/')[1]);
}
