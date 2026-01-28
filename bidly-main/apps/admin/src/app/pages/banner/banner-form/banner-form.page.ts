/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, inject, ResourceRef, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BannerCreateDto, BannerDto, BannerService } from '@api-client';
import { ModalBasement, ToastService } from '@client-libs';
import { UploadFile } from '@common';
import { BannerControllerCreate$Params } from 'libs/api-client/src/lib/fn/banner/banner-controller-create';
import { BannerControllerFindById$Params } from 'libs/api-client/src/lib/fn/banner/banner-controller-find-by-id';
import { BannerControllerUpdate$Params } from 'libs/api-client/src/lib/fn/banner/banner-controller-update';
import { of, tap } from 'rxjs';
import { FileUploader } from '../../../components/file-uploader/file-uploader.component';
import { Hint } from '../../../components/hint/hint.component';
import { Label } from '../../../components/label/label.component';
import { Toggle } from '../../../components/toggle/toggle.component';
import { UploadService } from '../../../services/upload.service';

@Component({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Label,
    FileUploader,
    Toggle,
    Hint,
  ],
  selector: 'app-banner-form',
  templateUrl: './banner-form.page.html',
})
export default class BannerFormPage extends ModalBasement {
  private readonly bannerService = inject(BannerService);
  private readonly uploadService = inject(UploadService);
  private readonly toastService = inject(ToastService);

  id = signal<string | undefined>(undefined);
  mode = signal<string>(this.props.mode);

  uploadHandler = this.uploadService.upload;
  deleteHandler = this.uploadService.delete;

  $data: ResourceRef<BannerDto | undefined> = rxResource({
    stream: () =>
      this.id()
        ? this.bannerService
            .bannerControllerFindById({
              id: this.id()!,
            } as BannerControllerFindById$Params)
            .pipe(
              tap((data: BannerDto) => {
                let pcImageArr: UploadFile[] = [];
                if (data.pcImage) {
                  pcImageArr = [
                    {
                      id: data.pcImage.id,
                      url: data.pcImage.url,
                      name: data.pcImage.name,
                      mimeType: data.pcImage.mimeType,
                      size: data.pcImage.size,
                      createdAt: data.pcImage.createdAt,
                      status: 'SUCCESS',
                    },
                  ];
                }

                let mobileImageArr: UploadFile[] = [];
                if (data.mobileImage) {
                  mobileImageArr = [
                    {
                      id: data.mobileImage.id,
                      url: data.mobileImage.url,
                      name: data.mobileImage.name,
                      mimeType: data.mobileImage.mimeType,
                      size: data.mobileImage.size,
                      createdAt: data.mobileImage.createdAt,
                      status: 'SUCCESS',
                    },
                  ];
                }
                this.form
                  .get('pcImage')
                  ?.setValue(pcImageArr, { emitEvent: false });
                this.form
                  .get('mobileImage')
                  ?.setValue(mobileImageArr, { emitEvent: false });

                this.form.patchValue({
                  isExposed: data.isExposed ?? false,
                  url: data.url ?? '',
                  title: data.title,
                });
              }),
            )
        : of(undefined),
  });

  form: FormGroup = new FormGroup({
    isExposed: new FormControl<boolean>(true),
    title: new FormControl('', [Validators.required]),
    pcImage: new FormControl<UploadFile[]>([], [Validators.minLength(1)]),
    mobileImage: new FormControl<UploadFile[]>([], [Validators.minLength(1)]),
    url: new FormControl(''),
  });

  constructor() {
    super();

    this.id.set(this.props.id || undefined);
    if (this.id()) this.$data.reload();
  }

  async submit(ev?: Event): Promise<void> {
    ev?.stopPropagation();
    ev?.preventDefault();

    const value = this.form.getRawValue();
    const body: BannerCreateDto = {
      isExposed: value.isExposed,
      title: value.title,
      url: value.url,
      pcImage: value.pcImage,
      mobileImage: value.mobileImage,
      mode: this.mode(),
    };

    if (this.id()) {
      this.bannerService
        .bannerControllerUpdate({
          id: this.id()!,
          body,
        } as BannerControllerUpdate$Params)
        .subscribe({
          next: () => {
            this.toastService.success('수정되었습니다.');
            this.close();
          },
          error: (err) => {
            this.toastService.error(err.message);
          },
        });
      return;
    } else {
      this.bannerService
        .bannerControllerCreate({
          body,
        } as BannerControllerCreate$Params)
        .subscribe({
          next: () => {
            this.toastService.success('등록되었습니다.');
            this.close();
          },
          error: (err) => {
            this.toastService.error(err.message);
          },
        });
    }
  }
}
