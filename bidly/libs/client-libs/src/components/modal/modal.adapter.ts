import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { isPlatformServer } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';

export const MODAL_CONFIRM = 'confirm';

@Component({
    selector: 'app-modal-basement',
    template: '',
})
export class ModalBasement<T = any> {
    public readonly modalService = inject(ModalService);
    public readonly platformId = inject(PLATFORM_ID);
    public readonly dialogRef = inject(DialogRef);

    readonly props = inject(DIALOG_DATA);

    constructor() {
        if (isPlatformServer(this.platformId)) return;
    }

    close(event?: Event): void {
        event?.stopPropagation();
        event?.preventDefault();

        const element = this.modalService.getElement();
        if (element) {
            const closeAnimation = element.animate([{ opacity: 1 }, { opacity: 0 }], {
                duration: 200,
                easing: 'ease-in-out',
            });
            closeAnimation!.onfinish = () => {
                this.dialogRef.close(event);
            };
        }
    }

    confirm(event?: Event): void {
        event?.stopPropagation();
        event?.preventDefault();

        const element = this.modalService.getElement();
        if (element) {
            const closeAnimation = element.animate([{ opacity: 1 }, { opacity: 0 }], {
                duration: 200,
                easing: 'ease-in-out',
            });
            closeAnimation!.onfinish = () => {
                this.dialogRef.close(MODAL_CONFIRM);
            };
        }
    }
}
