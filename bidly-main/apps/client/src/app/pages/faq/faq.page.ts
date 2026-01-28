import { CommonModule } from '@angular/common';
import { Component, computed, inject, model } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { FaqDto, FaqService, PageInfoDto } from '@api-client';
import { Align, Icon, Pagination, SafeHtmlPipe } from '@client-libs';
import { UserRole } from '@common';
import { FaqControllerSearchV1$Params } from 'libs/api-client/src/lib/fn/faq/faq-controller-search-v-1';
import { InputTextSearch } from '../../../../../../libs/client-libs/src/components/input/input-search/input-text-search.component';

@Component({
  selector: 'app-faq',
  imports: [
    CommonModule,
    InputTextSearch,
    Icon,
    SafeHtmlPipe,
    Pagination,
    FormsModule,
  ],
  templateUrl: './faq.page.html',
  styleUrl: './faq.page.css',
})
export default class FaqPage {
  pageNo = model(1);
  pageSize = model(10);
  query = model('');

  private readonly faqService = inject(FaqService);

  searchOption = computed<FaqControllerSearchV1$Params>(() => ({
    pageNo: this.pageNo(),
    pageSize: this.pageSize(),
    orderBy: 'createdAt',
    align: 'desc' as Align,
    targets: [UserRole.USER],
    query: this.query(),
    isExposed: true,
  }));

  $data = rxResource({
    params: () => this.searchOption(),
    stream: ({ params }) => this.faqService.faqControllerSearchV1(params),
  });

  isLoading = this.$data.isLoading;

  faqs = computed<FaqDto[]>(
    () => this.$data.value()?.items as unknown as FaqDto[],
  );
  pageInfo = computed<PageInfoDto>(
    () => this.$data.value()?.pageInfo as unknown as PageInfoDto,
  );

  extractTextContent(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;

    const images = div.querySelectorAll('img');
    images.forEach((img) => img.remove());

    return div.innerHTML;
  }

  extractFirstImageSrc(html: string): string | null {
    const div = document.createElement('div');
    div.innerHTML = html;

    const img = div.querySelector('img');
    return img?.getAttribute('src') || null;
  }

  toggleDetails(details: HTMLDetailsElement, event: MouseEvent) {
    event.preventDefault();
    if (details.open) {
      this.closeWithAnimation(details);
    } else {
      details.open = true;
      details.style.maxHeight = '60px';
      void details.offsetHeight;
      details.style.maxHeight = '1000px';
      setTimeout(() => {
        details.style.maxHeight = '';
      }, 500);
    }
  }

  closeWithAnimation(details: HTMLDetailsElement) {
    if (!details.open) return;
    details.style.maxHeight = details.scrollHeight + 'px';
    void details.offsetHeight;
    details.style.maxHeight = '60px';
    details.classList.add('closing');
    setTimeout(() => {
      details.open = false;
      details.classList.remove('closing');
      details.style.maxHeight = '';
    }, 500);
  }
}
