import { CommonModule } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import { BaseConfig } from '../common/config/config.adapter';
import { PageInfo } from '../common/types';
import { Icon } from '../icon/icon.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, Icon, FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class Pagination extends BaseConfig {
  pageInfo = input.required<PageInfo>();
  page = model(1);

  isFirstPage = computed(() => this.page() === 1);
  isLastPage = computed(
    () => this.page() === (this.pageInfo()?.totalPages || 1),
  );

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

  constructor() {
    super();

    afterNextRender(() => {
      if (this.pageInfo()?.pageNo) {
        this.page.set(this.pageInfo()!.pageNo!);
      }
    });
  }

  handleChange(page: number) {
    this.page.set(page);
  }
}
