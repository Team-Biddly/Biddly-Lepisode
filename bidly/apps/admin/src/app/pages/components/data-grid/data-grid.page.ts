import { AfterViewInit, Component, inject, model } from '@angular/core';
import {
  ColumnDefinition,
  GridOptions,
  SearchService,
  ServerSidePaginationDataGrid,
} from '@client-libs';
import { faker } from '@faker-js/faker';
import { Align, PageInfo } from 'libs/client-libs/src/components/common/types';

const Category = {
  A: 'A',
  B: 'B',
  C: 'C',
} as const;

@Component({
  selector: 'app-data-grid-docs',
  templateUrl: './data-grid.page.html',
  standalone: true,
  imports: [ServerSidePaginationDataGrid],
})
export default class DataGridDocs implements AfterViewInit {
  readonly searchService = inject(SearchService);

  page = model(1);
  pageSize = model(10);
  orderBy = model('createdAt');
  align = model<Align>('desc');
  query = model('');
  pageInfo = model<PageInfo | null>(null);

  cols: ColumnDefinition[] = [
    { type: 'text', field: 'title', name: '상품명' },
    {
      type: 'enum',
      field: 'category',
      name: '카테고리',
      badgeProps: {
        A: { color: 'primary', text: '의류' },
        B: { color: 'success', text: '가전제품' },
        C: { color: 'error', text: '식품' },
      },
    },
    { type: 'text', field: 'paymentInfo', name: '결제 정보' },
    { type: 'date', field: 'createdAt', name: '등록일자' },
  ];

  data: any[] = [];
  rowData: any[] = [];

  galleryOptions: GridOptions = {
    view: 'gallery',
    field: {
      title: 'title',
      content: 'content',
      image: 'image',
    },
  };

  gridOptions: GridOptions = {
    view: 'table',
    rowNumber: true,
    checkbox: true,
    row: {
      clickHandler: (row: any) => {},
      options: [
        {
          label: '수정',
          handler: (row: any) => console.log(row),
          icon: 'mdi:edit',
        },
        {
          label: '삭제',
          handler: (row: any) => console.log(row),
          icon: 'mdi:delete',
        },
      ],
    },
    badge: {
      variant: 'soft',
    },
  };

  ngAfterViewInit(): void {
    this.initRowData();
  }

  initRowData() {
    this.data = [];

    for (let i = 0; i < 100; i++) {
      this.data.push({
        id: i + 1,
        title: faker.commerce.productName(),
        category: faker.helpers.arrayElement(Object.values(Category)),
        paymentInfo: faker.finance.amount(),
        createdAt: faker.date.past(),
      });
    }

    this.refresh();
  }

  refresh() {
    const [rowData, pageInfo] = this.searchService.search(this.data, {
      pageNo: this.page(),
      pageSize: this.pageSize(),
      align: this.align(),
      orderBy: this.orderBy(),
      query: this.query(),
    });

    this.rowData = rowData;
    this.pageInfo.set(pageInfo);
  }
}
