// /* eslint-disable @nx/enforce-module-boundaries */
// import { CdkMenuModule } from '@angular/cdk/menu';
// import { CommonModule } from '@angular/common';
// import { Component, inject, ResourceRef } from '@angular/core';
// import { rxResource } from '@angular/core/rxjs-interop';
// import { Router, RouterLink } from '@angular/router';
// import { BannerDto, BannerService } from '@api-client';
// import {
//   Accordion,
//   AlertService,
//   Icon,
//   Menu,
//   MenuOption,
//   MODAL_CONFIRM,
//   ModalService,
//   TextField,
//   ToastService,
//   Button,
// } from '@client-libs';
// import { injectParams } from 'ngxtension/inject-params';
// import BannerFormPage from '../banner-form/banner-form.page';
// import { BannerControllerDelete$Params } from 'libs/api-client/src/lib/fn/banner/banner-controller-delete';
// import { BannerControllerFindById$Params } from 'libs/api-client/src/lib/fn/banner/banner-controller-find-by-id';
// import { tap } from 'rxjs';

// @Component({
//   selector: 'app-banner-detail',
//   imports: [
//     CommonModule,
//     Accordion,
//     Icon,
//     CdkMenuModule,
//     Menu,
//     MenuOption,
//     TextField,
//     RouterLink,
//     Button,
//   ],
//   templateUrl: './banner-detail.page.html',
//   styleUrl: './banner-detail.page.css',
// })
// export default class BannerDetailPage {
//   private readonly modalService = inject(ModalService);
//   private readonly bannerService = inject(BannerService);
//   private readonly router = inject(Router);
//   private readonly alertService = inject(AlertService);
//   private readonly toastService = inject(ToastService);

//   readonly id = injectParams('id');

//   $data: ResourceRef<BannerDto | undefined> = rxResource({
//     stream: () =>
//       this.bannerService
//         .bannerControllerFindById({
//           id: this.id() || '',
//         } as BannerControllerFindById$Params)
//         .pipe(tap((res) => console.log(res))),
//   });

//   openFormModal(ev?: Event): void {
//     ev?.stopPropagation();
//     this.modalService
//       .create(BannerFormPage, {
//         componentProps: {
//           id: this.id(),
//         },
//       })
//       .closed.subscribe({
//         next: () => {
//           this.$data.reload();
//         },
//       });
//   }

//   handleDelete(ev?: Event): void {
//     ev?.stopPropagation();
//     this.alertService
//       .open({
//         title: '배너 삭제',
//         content: `배너를 삭제하시겠습니까?`,
//         type: 'error',
//         buttons: {
//           confirm: {
//             text: '삭제',
//           },
//           cancel: {
//             text: '취소',
//           },
//         },
//       })
//       .closed.subscribe({
//         next: async (result) => {
//           if (result?.action === MODAL_CONFIRM) {
//             const id = this.id();
//             if (!id) return;
//             this.bannerService
//               .bannerControllerDelete({
//                 id,
//               } as BannerControllerDelete$Params)
//               .subscribe({
//                 next: () => {
//                   this.toastService.success('배너가 삭제되었습니다.');
//                   this.router.navigate(['/banner']);
//                 },
//                 error: () => {
//                   this.toastService.error('배너 삭제에 실패했습니다.');
//                 },
//               });
//           }
//         },
//       });
//   }
// }
