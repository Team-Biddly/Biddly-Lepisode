/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-empty-function */
import { CommonModule } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { fromEvent, throttleTime } from 'rxjs';

import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Camera } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem } from '@capacitor/filesystem';
import { Icon, ToastService } from '@client-libs';
import { UploadFile } from '@common';

export const FileAccept = {
  IMAGE: 'image/*',
  VIDEO: 'video/*',
  AUDIO: 'audio/*',
  ALL: '*/*',
} as const;

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [CommonModule, DragDropModule, Icon, FormsModule],
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploader),
      multi: true,
    },
  ],
})
export class FileUploader implements ControlValueAccessor, Validators {
  private readonly toastService = inject(ToastService);

  inputRef = viewChild<ElementRef<HTMLInputElement>>('inputRef');

  placeholder = input<string>();
  required = input<boolean, string>(false, { transform: booleanAttribute });
  maxLength = input<number>(1);
  minlength = input<number>(1);
  direction = input<'row' | 'column'>('column');
  uploadHandler = input.required<(file: File) => Promise<any>>();
  deleteHandler = input.required<(url: string) => Promise<void>>();
  accept = input<string>();
  useConvertToWebp = input<boolean>(false);

  type = computed(() => (this.accept()?.includes('image') ? 'image' : 'file'));

  disabled = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isDragOvered = signal<boolean>(false);

  value = model<UploadFile[]>([]);

  onChange = (value: UploadFile[]) => {};
  onTouched = () => {};
  writeValue = (value: UploadFile[]) => this.value.set(value || []);
  registerOnChange = (fn: any) => (this.onChange = fn);
  registerOnTouched = (fn: any): void => (this.onTouched = fn);
  setDisabledState = (isDisabled: boolean): void =>
    this.disabled.set(isDisabled);

  constructor() {
    afterNextRender(() => {
      if (this.inputRef()?.nativeElement) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        fromEvent(this.inputRef()?.nativeElement!, 'change')
          .pipe(throttleTime(300))
          .subscribe({
            next: (e) => {
              const files = (e.target as HTMLInputElement).files;
              this.onFileSelect(files);
            },
          });
      }
    });
  }

  removeFile(url: string) {
    this.value.update((item) => {
      const index = item.findIndex((item) => item.url === url);
      if (index !== -1) item.splice(index, 1);
      return item;
    });
  }

  onClick() {
    if (this.disabled()) return;

    if (Capacitor.isNativePlatform() && this.type() === 'image') {
      this.pickImages();
      return;
    }

    if (this.inputRef()?.nativeElement) {
      this.inputRef()?.nativeElement.click();
    }
  }

  onFileDrop(ev: DragEvent) {
    ev.preventDefault();
    if (this.disabled()) return;

    const files = ev.dataTransfer?.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      this.handleUploadProcess(fileList);
    }
  }

  onDragOver(e: DragEvent) {
    e.preventDefault();
    this.isDragOvered.set(true);
  }

  onDragLeave(e: DragEvent) {
    e.preventDefault();
    this.isDragOvered.set(false);
  }

  openImage(url: string) {
    window.open(url);
  }

  async onFileSelect(files: FileList | null) {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    await this.handleUploadProcess(fileList);
    if (this.inputRef()?.nativeElement)
      this.inputRef()!.nativeElement.value = '';
  }

  async pickImages() {
    if (this.disabled()) return;

    try {
      const maxRemainingCount = this.maxLength() - this.value().length;
      if (maxRemainingCount <= 0) {
        this.toastService.error(
          `최대 업로드 개수(${this.maxLength()}개)를 초과하였습니다.`,
        );
        return;
      }

      let files: File[] = [];
      if (Capacitor.isNativePlatform()) {
        files = await this.pickImagesNative({
          maxCount: maxRemainingCount,
        });
      } else {
        this.onClick(); // web
        return;
      }

      if (files.length === 0) return;

      await this.handleUploadProcess(files);
    } catch (error) {
      console.error('이미지 선택 중 오류 발생:', error);
      this.toastService.error('이미지 선택에 실패했습니다.');
    }
  }

  private async handleUploadProcess(files: File[]) {
    if (this.value().length + files.length > this.maxLength()) {
      this.toastService.error(
        `최대 업로드 개수(${this.maxLength()}개)를 초과하였습니다.`,
      );
      return;
    }

    this.isLoading.set(true);

    for (const file of files) {
      if (this.value().length >= this.maxLength()) {
        this.toastService.error(
          `최대 업로드 개수(${this.maxLength()}개)를 초과하였습니다.`,
        );
        break;
      }

      let uploadFile = file;
      if (this.useConvertToWebp() && file.type.startsWith('image/')) {
        try {
          uploadFile = await this.convertImageToWebp(file);
        } catch (e) {
          this.toastService.error('이미지 WebP 변환에 실패했습니다.');
          continue;
        }
      }

      try {
        const result = await this.uploadFile(uploadFile, this.uploadHandler());
        this.value().push({
          url: result.url,
          size: result.size,
          name: result?.name || this.getFilenameFromUrl(result.url || ''),
          mimeType: result?.mimeType || uploadFile.type,
          status: result?.status || 'SUCCESS',
        });
        this.onChange(this.value());
      } catch (error: any) {
        console.error('fail to upload:', error);
        continue;
      }
    }

    this.isLoading.set(false);
  }

  private async pickImagesNative({
    maxCount,
  }: {
    maxCount: number;
  }): Promise<File[]> {
    const fileList: File[] = [];

    try {
      const photos = await Camera.pickImages({
        limit: maxCount,
        quality: 100,
      });

      for (const [index, photo] of photos.photos.entries()) {
        try {
          // Read file data
          const fileResult = await Filesystem.readFile({
            path: photo.path as string,
          });

          // Create base64 URI
          const uri = `data:image/${photo.format};charset=utf-8;base64,${fileResult.data}`;

          // Convert to File object
          const response = await fetch(uri);
          const blob = await response.blob();
          const file = new File([blob], `image${index}.${photo.format}`, {
            type: `image/${photo.format};charset=utf-8`,
          });

          fileList.push(file);
        } catch (error) {
          console.error('파일 처리 중 오류 발생:', error);
        }
      }
    } catch (error) {
      console.error('이미지 선택 중 오류 발생:', error);
    }

    return fileList;
  }

  onDrop(ev: CdkDragDrop<UploadFile[]>) {
    if (ev.container === ev.previousContainer) {
      const items = [...this.value()];
      moveItemInArray(items, ev.previousIndex, ev.currentIndex);
      this.value.set(items);
      this.onChange(this.value());
    }
  }

  async uploadFile(
    file: File,
    uploadHandler: (file: File) => Promise<any>,
  ): Promise<UploadFile> {
    try {
      const res = await uploadHandler(file);
      return {
        ...res,
        filename: res.filename || this.getFilenameFromUrl(res.url),
        status: 'SUCCESS',
      };
    } catch (error: any) {
      throw error;
    }
  }

  async deleteFile(
    url: string,
    deleteHandler?: (url: string) => Promise<void>,
  ): Promise<void> {
    if (deleteHandler) {
      try {
        await deleteHandler(url);
      } catch (error: any) {
        console.error('파일 삭제 실패:', error);
        throw error;
      }
    }
  }

  async convertImageToWebp(file: File): Promise<File> {
    return new Promise<File>((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject('Canvas context 생성 실패');
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(
              (blob) => {
                if (!blob) return reject('WebP 변환 실패');
                const webpFile = new File(
                  [blob],
                  file.name.replace(/\.[^.]+$/, '.webp'),
                  {
                    type: 'image/webp',
                  },
                );
                resolve(webpFile);
              },
              'image/webp',
              1,
            );
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = () => reject('이미지 로드 실패');
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject('파일 읽기 실패');
      reader.readAsDataURL(file);
    });
  }

  getFilenameFromUrl(url: string): string {
    if (!url) return '';
    if (!url.includes('/')) return url;
    return url.split('/').pop() || '';
  }
}
