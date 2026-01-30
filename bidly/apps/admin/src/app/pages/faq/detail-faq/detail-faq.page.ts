import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  ResourceRef,
  Signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FaqDto, FaqService } from '@api-client';
import {
  AlertService,
  Button,
  Icon,
  Menu,
  MenuOption,
  ToastService,
} from '@client-libs';
import { injectParams } from 'ngxtension/inject-params';
import { catchError, filter, of } from 'rxjs';

@Component({
  selector: 'app-detail-faq',
  imports: [
    CommonModule,
    RouterModule,
    Button,
    RouterLink,
    Menu,
    MenuOption,
    CdkMenuModule,
    Icon,
  ],
  templateUrl: './detail-faq.page.html',
  styleUrl: './detail-faq.page.scss',
})
export default class DetailFaqPage {
  readonly faqService = inject(FaqService);
  readonly alertService = inject(AlertService);
  readonly toastService = inject(ToastService);
  readonly router = inject(Router);

  isInfoOpen = true;
  isContentOpen = true;
  id = injectParams('id');

  faq$: ResourceRef<FaqDto | undefined> = rxResource({
    stream: ({ params }) => {
      if (!params.id) return of(undefined);

      return this.faqService.faqControllerFindByIdV1({ id: params.id }).pipe(
        catchError((err) => {
          this.toastService.error(err.message);
          return of(undefined);
        }),
      );
    },
    params: () => ({ id: this.id() }),
  });
  faq: Signal<FaqDto | undefined> = computed(() => this.faq$.value());

  /**
   * @name handleDelete
   * @description FAQ 삭제
   * @returns {void}
   */
  handleDelete(faq: FaqDto): void {
    this.alertService
      .open({
        type: 'warning',
        icon: { name: 'danger' },
        title: 'FAQ 삭제',
        content: `FAQ를 삭제하시겠습니까?
          삭제되며 삭제 후에는 복구할 수 없습니다.`,
        buttons: { confirm: { text: '삭제' } },
      })
      .closed.pipe(filter((result) => result?.action === 'confirm'))
      .subscribe({
        next: () => {
          this.faqService
            .faqControllerDeleteV1({ id: this.id() as string })
            .subscribe({
              next: () => {
                this.router.navigate(['/faq'], { replaceUrl: true });
                this.toastService.success('FAQ가 삭제되었습니다.');
                setTimeout(() => {
                  this.faq$.reload();
                });
              },
              error: (err) => {
                this.toastService.error(err.message);
              },
            });
        },
      });
  }
}
