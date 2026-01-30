import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PreStandardService } from '@api-client';
import { Icon, Pagination } from '@client-libs';
import { PreStandardItemComponent } from '../../../pre-standard/pre-standard-item/pre-standard-item.component';

@Component({
  selector: 'app-bookmark-pre-spec',
  imports: [CommonModule, Icon, PreStandardItemComponent, Pagination],
  templateUrl: './bookmark-pre-spec.page.html',
  styleUrl: './bookmark-pre-spec.page.css',
})
export default class BookmarkPreSpecPage {
  private readonly preStandardService = inject(PreStandardService);

  pageNo = signal(1);
  pageSize = signal(10);

  $result = rxResource({
    params: () => ({
      pageNo: this.pageNo(),
      pageSize: this.pageSize(),
    }),
    stream: ({ params }) =>
      this.preStandardService.preStandardControllerGetBookmarked(params),
  });
}
