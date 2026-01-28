/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommonModule } from '@angular/common';
import { Component, inject, input, model, WritableSignal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

// 파일 타입별 MIME 타입 매핑
const FILE_MIME_TYPES: Record<string, string> = {
  // 이미지
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  bmp: 'image/bmp',
  ico: 'image/x-icon',

  // 문서
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  hwp: 'application/haansofthwp',
  txt: 'text/plain',
  rtf: 'application/rtf',

  // 압축
  zip: 'application/zip',
  rar: 'application/x-rar-compressed',
  '7z': 'application/x-7z-compressed',
  tar: 'application/x-tar',
  gz: 'application/gzip',

  // 기타
  json: 'application/json',
  xml: 'application/xml',
  csv: 'text/csv',
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  ts: 'application/typescript',
};

@Component({
  selector: 'app-file-download',
  imports: [CommonModule],
  template: `<button class="min-w-max" (click)="downloadFile($event)">
    <ng-content />
  </button>`,
})
export default class FileDownloadComponent {
  readonly toastService = inject(ToastrService);

  url = input.required<string>();
  size = input<number>(0);
  filename = input<string>('file');

  /**
   * @description 파일 다운로드 로딩상태
   */
  isLoading: WritableSignal<boolean> = model<boolean>(false);

  /**
   * @name downloadFile
   * @description 파일 다운로드
   * @param {Event} ev
   * @returns {void}
   */
  async downloadFile(ev?: Event): Promise<void> {
    this.isLoading.set(true);
    try {
      await this.downloadForWeb();
    } catch (error) {
      console.error('파일 다운로드 오류:', error);
      this.toastService.error('다운로드에 실패했습니다.');
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * @name getFileExtension
   * @description 파일명에서 확장자 추출
   * @param {string} filename
   * @returns {string}
   */
  private getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1) return '';
    return filename.substring(lastDotIndex + 1).toLowerCase();
  }

  /**
   * @name getMimeType
   * @description 파일 확장자에 따른 MIME 타입 반환
   * @param {string} filename
   * @returns {string}
   */
  private getMimeType(filename: string): string {
    const extension = this.getFileExtension(filename);
    return FILE_MIME_TYPES[extension] || 'application/octet-stream';
  }

  /**
   * @name isImageFile
   * @description 이미지 파일인지 확인
   * @param {string} filename
   * @returns {boolean}
   */
  private isImageFile(filename: string): boolean {
    const extension = this.getFileExtension(filename);
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(
      extension,
    );
  }

  /**
   * @name isDocumentFile
   * @description 문서 파일인지 확인 (HWP 포함)
   * @param {string} filename
   * @returns {boolean}
   */
  private isDocumentFile(filename: string): boolean {
    const extension = this.getFileExtension(filename);
    return [
      'pdf',
      'doc',
      'docx',
      'xls',
      'xlsx',
      'ppt',
      'pptx',
      'hwp',
      'txt',
      'rtf',
    ].includes(extension);
  }

  /**
   * @name downloadForWeb
   * @description 웹에서 파일 다운로드 (다양한 파일 형태 지원)
   * @returns {Promise<void>}
   */
  private async downloadForWeb(): Promise<void> {
    if (!this.url()) {
      this.toastService.error('다운로드할 URL이 없습니다.');
      return;
    }

    const filename = this.filename();
    const url = await this.getDownloadUrl();

    // 파일 타입에 따른 추가 처리
    if (this.isDocumentFile(filename)) {
      // HWP, PDF 등 문서 파일의 경우 브라우저에서 열기 시도를 방지
      this.forceDownload(url, filename);
    } else {
      // 일반 파일 다운로드
      this.downloadFile2(url, filename);
    }
  }

  /**
   * @name downloadFile2
   * @description 일반 파일 다운로드
   * @param {string} url
   * @param {string} filename
   * @returns {void}
   */
  private downloadFile2(url: string, filename: string): void {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    // revokeObjectURL 지연
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      a.remove();
    }, 1000);
  }

  /**
   * @name forceDownload
   * @description 강제 다운로드 (브라우저에서 열기 방지)
   * @param {string} url
   * @param {string} filename
   * @returns {void}
   */
  private forceDownload(url: string, filename: string): void {
    // iframe을 사용한 다운로드로 브라우저에서 바로 열기 방지
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;

    // Content-Disposition 헤더가 없는 경우를 대비한 대안
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    a.target = '_blank';

    // HWP 파일 등의 경우 특별 처리
    const extension = this.getFileExtension(filename);
    if (extension === 'hwp') {
      // HWP 파일은 반드시 다운로드되도록 처리
      a.setAttribute('rel', 'noopener noreferrer');
    }

    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      a.remove();
      if (iframe.parentNode) {
        iframe.remove();
      }
    }, 1000);
  }

  /**
   * @name getDownloadUrl
   * @description 다운로드 URL 가져오기 (파일 타입별 최적화)
   * @returns {Promise<string>}
   */
  private async getDownloadUrl(): Promise<string> {
    try {
      const filename = this.filename();
      const mimeType = this.getMimeType(filename);

      const res = await fetch(this.url(), {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          Accept: `${mimeType}, application/octet-stream, */*`,
        },
        mode: 'cors',
        referrerPolicy: 'no-referrer-when-downgrade',
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      let blob = await res.blob();

      // 응답의 Content-Type이 예상과 다른 경우 MIME 타입 강제 설정
      if (blob.type !== mimeType && mimeType !== 'application/octet-stream') {
        blob = new Blob([blob], { type: mimeType });
      }

      return window.URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error getting download URL:', error);
      // 에러 발생 시 원본 URL 반환 (직접 다운로드 시도)
      return this.url();
    }
  }

  /**
   * @name blobToBase64
   * @description Blob을 Base64 문자열로 변환
   * @param {Blob} blob
   * @returns {Promise<string>}
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * @name fileSizeFormat
   * @description 파일 크기 포맷팅
   * @param {number} size
   * @returns {string}
   */
  public fileSizeFormat(size: number): string {
    if (size < 1024) {
      return `${size} bytes`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else if (size < 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  }

  /**
   * @name getFileTypeDescription
   * @description 파일 타입 설명 반환
   * @param {string} filename
   * @returns {string}
   */
  public getFileTypeDescription(filename: string): string {
    const extension = this.getFileExtension(filename).toUpperCase();

    const typeDescriptions: Record<string, string> = {
      HWP: '한글 문서',
      PDF: 'PDF 문서',
      DOC: 'Word 문서',
      DOCX: 'Word 문서',
      XLS: 'Excel 스프레드시트',
      XLSX: 'Excel 스프레드시트',
      PPT: 'PowerPoint 프레젠테이션',
      PPTX: 'PowerPoint 프레젠테이션',
      JPG: '이미지',
      JPEG: '이미지',
      PNG: '이미지',
      GIF: '이미지',
      ZIP: '압축 파일',
      RAR: '압축 파일',
      TXT: '텍스트 파일',
    };

    return typeDescriptions[extension] || `${extension} 파일`;
  }
}
