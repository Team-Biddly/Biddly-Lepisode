// import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
// import { CommonModule } from '@angular/common';
// import {
//   Component,
//   HostListener,
//   Inject,
//   Injectable,
//   signal,
// } from '@angular/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MarkdownComponent } from 'ngx-markdown';

// export type AlertProps = {
//   icon?: string;
//   title?: string;
//   message?: string;
//   checked?: boolean;
//   content?: string | Record<string, string>;
//   button: {
//     label?: string;
//     class?: string;
//   };
// };

// export type AlertResult = {
//   role: 'confirm' | 'cancel';
//   data: Record<string, any>;
// };

// @Injectable({
//   providedIn: 'root',
// })
// export class AlertService {
//   currentOpenAlert = signal<DialogRef<any, any> | null>(null);

//   constructor(private readonly dialog: Dialog) {}

//   public open(data?: AlertProps): DialogRef<AlertResult, AlertComponent> {
//     const dialogRef = this.dialog.open<AlertResult, unknown, AlertComponent>(
//       AlertComponent,
//       {
//         data,
//         hasBackdrop: true,
//         disableClose: true,
//       },
//     );

//     this.currentOpenAlert.set(dialogRef);

//     dialogRef.closed.subscribe(() => this.currentOpenAlert.set(null));

//     return dialogRef;
//   }

//   close = () => this.dialog.closeAll();
// }

// @Component({
//   selector: 'app-alert',
//   imports: [CommonModule, FormsModule, ReactiveFormsModule, MarkdownComponent],
//   template: `
//     <div
//       class="flex flex-col overflow-hidden bg-white p-4 gap-6 rounded-2xl max-w-[296px] min-w-[296px] w-full sm:min-w-[368px] sm:max-w-full "
//     >
//       <section
//         class="flex flex-col items-center justify-center w-full gap-3 select-none"
//       >
//         @if (data.icon) {
//           <app-icon
//             size="lg"
//             [name]="getIconName(data.icon)"
//             [class]="getIconClass(data.icon)"
//           />
//         }
//         @if (data.title) {
//           <p class="text-xl font-semibold text-gray-800">
//             {{ data.title }}
//           </p>
//         }
//       </section>

//       <section id="alert-content" class="flex flex-col gap-6">
//         @if (data.content) {
//           <div class="flex flex-col w-full gap-3 p-3 border-gray-200 border-y">
//             @for (item of parseContent(data.content); track $index) {
//               <div class="flex items-center justify-between ">
//                 <p class="text-sm text-gray-500 min-w-20">{{ item.label }}</p>
//                 <p
//                   class="text-sm text-gray-800 line-clamp-1"
//                   style="text-overflow: ellipsis;"
//                 >
//                   {{ item.value }}
//                 </p>
//               </div>
//             }
//           </div>
//         }
//         @if (data.message) {
//           <markdown class="text-sm text-center text-gray-600">
//             {{ data.message }}
//           </markdown>
//         }
//       </section>

//       <section class="flex justify-end w-full gap-3 select-none">
//         <button
//           class="w-full px-3 py-2 text-sm text-gray-800 transition-all duration-300 ease-in-out bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-500"
//           (click)="close()"
//         >
//           취소
//         </button>
//         @if (data.checked) {
//           <button
//             class="w-full px-3 py-2 text-sm text-white transition-all duration-300 ease-in-out hover:opacity-80 disabled:bg-neutral-200 rounded-xl disabled:text-white disabled:cursor-not-allowed"
//             [class]="getButtonClass(data.icon)"
//             (click)="confirm()"
//             [disabled]="!isChecked()"
//           >
//             {{ data.button.label || '확인' }}
//           </button>
//         } @else {
//           <button
//             class="w-full px-3 py-2 text-sm text-white transition-all duration-300 ease-in-out hover:opacity-80 disabled:bg-neutral-200 rounded-xl disabled:text-white disabled:cursor-not-allowed"
//             [class]="getButtonClass(data.icon)"
//             (click)="confirm()"
//           >
//             {{ data.button.label || '확인' }}
//           </button>
//         }
//       </section>
//     </div>
//   `,
// })
// class AlertComponent {
//   confirmButtonClasses = signal<string>(
//     'text-danger-500 hover:bg-danger-500 hover:text-white',
//   );
//   isChecked = signal<boolean>(false);

//   @HostListener('keydown.enter', ['$event'])
//   onEnter(event: KeyboardEvent) {
//     if (event.key === 'Enter') {
//       event.preventDefault();
//       event.stopPropagation();
//       this.confirm();
//     }
//   }

//   @HostListener('keydown.esc', ['$event'])
//   onEsc(event: KeyboardEvent) {
//     if (event.key === 'Escape') {
//       event.preventDefault();
//       event.stopPropagation();
//       this.close();
//     }
//   }

//   constructor(
//     @Inject(DIALOG_DATA) public data: AlertProps,
//     private readonly dialogRef: DialogRef,
//   ) {}

//   getIconName(icon: string) {
//     switch (icon) {
//       case 'danger':
//         return 'solar:danger-circle-bold';
//       case 'completed':
//         return 'material-symbols:check-circle-rounded';
//       case 'success':
//         return 'material-symbols:check-circle-rounded';
//       default:
//         return '';
//     }
//   }

//   getIconClass(icon: string) {
//     switch (icon) {
//       case 'danger':
//         return 'text-red-500';
//       case 'completed':
//         return 'text-gray-500';
//       case 'success':
//         return 'text-primary-500';
//       default:
//         return '';
//     }
//   }

//   getButtonClass(icon?: string) {
//     switch (icon) {
//       case 'danger':
//         return 'bg-red-500 hover:opacity-80 disabled:bg-neutral-200';
//       case 'completed':
//         return 'bg-gray-500 hover:opacity-80 disabled:bg-neutral-200';
//       case 'completed':
//         return 'bg-primary-500 hover:opacity-80 disabled:bg-neutral-200';
//       default:
//         return 'bg-primary hover:opacity-80 disabled:bg-neutral-200';
//     }
//   }

//   parseContent(
//     content: string | Record<string, string>,
//   ): { label: string; value: string }[] {
//     if (typeof content === 'object') {
//       return Object.keys(content).map((key) => ({
//         label: key,
//         value: content[key],
//       }));
//     }
//     return [];
//   }

//   close() {
//     this.dialogRef.close({
//       role: 'cancel',
//     });
//   }

//   confirm() {
//     this.dialogRef.close({
//       role: 'confirm',
//     });
//   }
// }

import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';
import { AlertOptions, AlertResult } from '../components/alert/alert.type';
import { AlertComponent } from '../components/alert/alert.component';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly dialog = inject(Dialog);

  open(options: AlertOptions) {
    return this.dialog.open<AlertResult>(AlertComponent, {
      maxHeight: '100%',
      data: options,
      disableClose: true,
      ariaModal: true,
      restoreFocus: true,
    });
  }
}
