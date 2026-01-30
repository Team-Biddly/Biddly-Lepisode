/* eslint-disable @angular-eslint/component-class-suffix */
import { CommonModule } from '@angular/common';
import { Component, computed, input, model } from '@angular/core';
import { BaseConfig } from '../common/config/config.adapter';
import { PageInfo, Size } from '../common/types';
import { Icon } from '../icon/icon.component';

@Component({
  selector: 'app-select-page',
  standalone: true,
  imports: [CommonModule, Icon],
  templateUrl: './select-page.component.html',
  styleUrl: './select-page.component.scss',
})
export class SelectPage extends BaseConfig {
  pageInfo = input.required<PageInfo>();
  page = model(1);

  pages = computed(() => {
    const totalPages = this.pageInfo()?.totalPages || 1;
    const pageNo = this.pageInfo()?.pageNo || 1;

    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    }

    if (totalPages > 5) {
      if (pageNo < 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (pageNo > totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = pageNo - 2; i <= pageNo + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  });
}
