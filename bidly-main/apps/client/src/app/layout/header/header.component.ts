import { CommonModule, Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Icon } from '@client-libs';
import { injectNavigationEnd } from 'ngxtension/navigation-end';
import { map } from 'rxjs';
import { DefaultHeaderComponent } from './components/default-header/default-header.component';

export const LAYOUT_TYPE = {
  DEFAULT: 'DEFAULT',
  ARROW: 'ARROW',
} as const;

export interface IRouterData {
  layoutType: keyof typeof LAYOUT_TYPE; // 레이아웃 타입
  title?: string; // 제목
  disableBack?: boolean; // 뒤로가기 버튼 비활성화 여부
}

@Component({
  selector: 'app-header',
  imports: [CommonModule, Icon, DefaultHeaderComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  readonly location = inject(Location);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly navigationEnd$ = injectNavigationEnd();

  LAYOUT_TYPE = LAYOUT_TYPE;

  isMyPage = signal<boolean>(false);

  data = toSignal<IRouterData | null>(
    this.navigationEnd$.pipe(
      map((res) => {
        if (res?.url?.includes('my-page')) {
          this.isMyPage.set(true);
        } else {
          this.isMyPage.set(false);
        }
        let route = this.activatedRoute;
        while (route?.firstChild) route = route.firstChild;

        const data = route?.snapshot?.data;
        return data && Object.keys(data).length > 0
          ? (data as IRouterData)
          : null;
      }),
    ),
  );
}
