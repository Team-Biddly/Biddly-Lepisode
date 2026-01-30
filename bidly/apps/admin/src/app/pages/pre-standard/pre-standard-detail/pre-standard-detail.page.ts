import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { PreStandardService } from '@api-client';
import { Icon, ToastService } from '@client-libs';
import { injectParams } from 'ngxtension/inject-params';
import { of } from 'rxjs';

@Component({
  selector: 'app-pre-standard-detail',
  imports: [RouterLink, Icon, DatePipe, DecimalPipe],
  templateUrl: './pre-standard-detail.page.html',
  styleUrl: './pre-standard-detail.page.css',
})
export default class PreStandardDetailPage {
  private readonly prestandardService = inject(PreStandardService);
  private readonly toast = inject(ToastService);
  private readonly prestandardId = injectParams('prestandardId');

  prestandard$ = rxResource({
    params: () => this.prestandardId(),
    stream: ({ params }) =>
      params
        ? this.prestandardService.preStandardControllerFindById({ id: params })
        : of(null),
  });

  submit(keyword: string) {
    const prestandard = this.prestandard$.value();
    if (!prestandard) return;

    const keywords = keyword.split(',').map((kw) => kw.trim());

    if (keywords.length === 0) return;
    if (
      prestandard.keywords &&
      keywords.every((kw) => prestandard.keywords.includes(kw))
    )
      return;

    this.prestandardService
      .preStandardControllerUpdateKeywords({
        id: prestandard.id,
        body: { keywords },
      })
      .subscribe(() => {
        this.toast.success('키워드가 업데이트되었습니다.');
        this.prestandard$.reload();
      });
  }
}
