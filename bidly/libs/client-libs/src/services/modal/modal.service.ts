/* eslint-disable @angular-eslint/prefer-inject */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { IModal, ModalConfig } from './modal.interface';

@Injectable({
  providedIn: 'root',
})
export class ModalService implements IModal {
  private modal: DialogRef<any, ComponentType<any>> | null = null;
  private id = signal<number>(0);
  private ids = signal<string[]>([]);
  private readonly platformId = inject(PLATFORM_ID);

  constructor(private dialog: Dialog) {}

  create<T = any>(
    component: ComponentType<any>,
    config?: ModalConfig<T>,
  ): DialogRef<any, ComponentType<any>> {
    if (isPlatformBrowser(this.platformId)) {
      this.id.set(this.id() + 1);

      this.modal = this.dialog.open<any, unknown, ComponentType<any>>(
        component,
        {
          data: config?.componentProps,
          id: `modal-${this.id()}`,
          hasBackdrop: config?.hasBackdrop ?? true,
          disableClose: config?.disableClose ?? true,
          providers: config?.providers,
          autoFocus: false,
        },
      );

      this.ids().push(this.modal.id);

      return this.modal;
    }

    return null!;
  }

  /**
   * @deprecated modal.adapter.ts의 close로 대체
   * @param result
   */
  close(result?: unknown) {
    const top = this.getTop();
    const element = this.getElement();
    if (element) {
      const closeAnimation = element.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 200,
        easing: 'ease-in-out',
      });
      closeAnimation!.onfinish = () => {
        if (top) top.close(result);
        this.ids().pop();
      };
    }
  }

  getTop() {
    const dialogs = document.querySelectorAll('cdk-dialog-container');
    const topId = dialogs.item(dialogs.length - 1)?.id;
    if (topId) {
      const top = this.dialog.getDialogById(topId);
      return top;
    }

    return null;
  }

  getElement(): HTMLElement | null {
    const dialogs = document.querySelectorAll('cdk-dialog-container');
    const topId = dialogs.item(dialogs.length - 1)?.id;
    if (topId) {
      return document.getElementById(topId);
    }

    return null;
  }
}
