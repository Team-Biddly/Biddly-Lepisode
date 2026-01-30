import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { PreStandardService } from '@api-client';
import { Icon } from '@client-libs';
import { catchError, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-g2b-file',
  imports: [CommonModule, Icon],
  template: `
    <div class="flex items-center justify-between p-4">
      <div class="flex items-center gap-2 overflow-hidden">
        <span class="truncate">{{ filename() }}</span>
      </div>
      <a [href]="url()" target="_blank" rel="noopener noreferrer">
        <div
          class="flex items-center gap-2 border border-zinc-200 rounded-sm px-3 py-1 bg-white hover:bg-zinc-50 transition-colors"
        >
          <app-icon
            name="mdi:tray-arrow-down"
            class="text-zinc-400"
            size="xs"
          />
          <span class="text-zinc-600 min-w-max">다운로드</span>
        </div>
      </a>
    </div>
  `,
})
export class G2bFileComponent {
  private readonly preStandardService = inject(PreStandardService);

  readonly url = input.required<string>();

  private readonly fileInfo$ = toSignal(
    toObservable(this.url).pipe(
      switchMap((url) => {
        if (!url) return of('첨부파일');

        return this.preStandardService
          .preStandardControllerGetFileInfo({ url })
          .pipe(
            map((res) => res.filename),
            catchError((error) => {
              console.error('파일 정보 조회 실패:', error);
              return of('첨부파일');
            }),
          );
      }),
    ),
    { initialValue: '첨부파일 확인 중...' },
  );

  readonly filename = computed(() => this.fileInfo$());
}
