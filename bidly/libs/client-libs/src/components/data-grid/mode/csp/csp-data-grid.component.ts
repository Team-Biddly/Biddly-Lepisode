import { CommonModule } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { SearchService } from '../../../../services/search.service';
import { Align } from '../../../common/types';
import { Pagination } from '../../../pagination/pagination.component';
import { DataGridAdapter } from '../../data-grid.adapter';
import { DataGridStore } from '../../data-grid.store';
import { GridHeader } from '../../header/grid-header.component';
import { GridGallery } from '../../view/gallery/gallery.component';
import { GridTable } from '../../view/table/table.component';

@Component({
  host: {
    ngSkipHydration: 'true',
  },
  selector: 'app-csp-data-grid',
  templateUrl: './csp-data-grid.component.html',
  styleUrls: ['./csp-data-grid.component.css'],
  standalone: true,
  imports: [GridTable, GridHeader, GridGallery, Pagination, CommonModule],
  providers: [DataGridStore],
})
export class ClientSidePaginationDataGrid extends DataGridAdapter {
  readonly searchService = inject(SearchService);

  page = model(1);
  pageSize = model(10);
  orderBy = model('createdAt');
  align = model<Align>('desc');
  query = model('');

  refresh() {
    const [rowData, pageInfo] = this.searchService.search(this.rowData(), {
      pageNo: this.page(),
      pageSize: this.pageSize(),
      align: this.align(),
      orderBy: this.orderBy(),
      query: this.query(),
    });

    this.pageInfo.set(pageInfo);

    this.store.init({
      columns: this.columns(),
      options: this.options()!,
      rowData,
    });
  }
}
