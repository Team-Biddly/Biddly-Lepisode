import { Injectable } from '@angular/core';
import { DataGridSearchOptions } from '../components/data-grid/types/pagination.type';

@Injectable({ providedIn: 'root' })
export class SearchService {
  search(
    data: any[] | undefined,
    searchOption: DataGridSearchOptions,
  ): [any[], any] {
    if (!data) {
      return [
        [],
        {
          pageItems: 0,
          pageNo: 1,
          pageSize: 0,
          totalItems: 0,
          totalPages: 0,
        },
      ];
    }

    const { pageNo, pageSize, align, orderBy, query } = searchOption;
    let result = data;

    if (query) {
      result = result.filter((item) => {
        return Object.keys(item).some((key) => {
          return item[key].toString().includes(query);
        });
      });
    }

    if (orderBy) {
      result = result.sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
          return align === 'asc' ? -1 : 1;
        }
        if (a[orderBy] > b[orderBy]) {
          return align === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    const total = result.length;
    const start = (pageNo - 1) * pageSize;
    const end = start + pageSize;
    const rows = result.slice(start, end);

    return [
      rows,
      {
        pageItems: rows.length,
        pageNo,
        pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / pageSize),
      },
    ];
  }
}
