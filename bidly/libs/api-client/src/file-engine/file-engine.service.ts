import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data';

import {
  ClassifyResponse,
  UploadResponse,
  DocConvertResponse,
  HwpConvertResponse,
  PdfConvertResponse,
  SearchResponse,
} from './interfaces/file-engine.interface';

@Injectable()
export class FileEngineService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('PYTHON_FILE_ENGINE_URL');
    if (!this.baseUrl) {
      throw new InternalServerErrorException(
        'PYTHON_FILE_ENGINE_URL이 구성되지 않았습니다.',
      );
    }
  }

  async classifyFile(file: Express.Multer.File): Promise<ClassifyResponse> {
    const formData = new FormData();
    formData.append('file', file.buffer, { filename: file.originalname });

    const { data } = await firstValueFrom(
      this.httpService.post<ClassifyResponse>(
        `${this.baseUrl}/test/classify`,
        formData,
        {
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
          },
        },
      ),
    );
    return data;
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file.buffer, { filename: file.originalname });

    const { data } = await firstValueFrom(
      this.httpService.post<UploadResponse>(
        `${this.baseUrl}/test/upload`,
        formData,
        {
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
          },
        },
      ),
    );
    return data;
  }

  async convertHwp(noticeId: number): Promise<HwpConvertResponse> {
    const { data } = await firstValueFrom(
      this.httpService.post<HwpConvertResponse>(
        `${this.baseUrl}/test/hwp_convert/${noticeId}`,
      ),
    );
    return data;
  }

  async convertDoc(noticeId: number): Promise<DocConvertResponse> {
    const { data } = await firstValueFrom(
      this.httpService.post<DocConvertResponse>(
        `${this.baseUrl}/test/doc_convert/${noticeId}`,
      ),
    );
    return data;
  }

  async convertPdf(noticeId: number): Promise<PdfConvertResponse> {
    const { data } = await firstValueFrom(
      this.httpService.post<PdfConvertResponse>(
        `${this.baseUrl}/test/pdf_convert/${noticeId}`,
      ),
    );
    return data;
  }

  async searchKeyword(keyword: string): Promise<SearchResponse> {
    const { data } = await firstValueFrom(
      this.httpService.get<SearchResponse>(`${this.baseUrl}/test/search`, {
        params: { keyword },
      }),
    );
    return data;
  }
}
