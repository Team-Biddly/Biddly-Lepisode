import { CommonModule, Location } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PreStandardOpinionDto, PreStandardService } from '@api-client';
import { Icon } from '@client-libs';
import { injectParams } from 'ngxtension/inject-params';
import { of, tap } from 'rxjs';
import { BookmarkIconComponent } from '../../../components/bookmark-icon/bookmark-icon.component';
import FileDownloadComponent from '../../../components/file-download/file-download.component';
import { G2bFileComponent } from '../../../components/g2b-file/g2b-file.component';

@Component({
  selector: 'app-pre-standard-detail',
  imports: [
    CommonModule,
    Icon,
    BookmarkIconComponent,
    FileDownloadComponent,
    G2bFileComponent,
  ],
  templateUrl: './pre-standard-detail.page.html',
  styleUrl: './pre-standard-detail.page.css',
})
export default class PreStandardDetailPage {
  private readonly preStandardService = inject(PreStandardService);
  private readonly preStandardId = injectParams('preStandardId');
  protected readonly location = inject(Location);

  $preStandard = rxResource({
    params: () => this.preStandardId(),
    stream: ({ params }) =>
      params
        ? this.preStandardService
            .preStandardControllerFindById({ id: params })
            .pipe(tap((res) => console.debug(res)))
        : of(null),
  });

  selectedOpinion = signal<PreStandardOpinionDto | null>(null);

  data = computed(() => this.$preStandard.value());

  formatItem(item: string) {
    const match = item.match(/^\[\d+\^(.*?)\^([^\]]+)\]$/);
    if (match) {
      return {
        code: match[1] || '', // 코드가 없으면 빈 문자열
        name: match[2],
      };
    }
    return { code: '', name: item };
  }
}
