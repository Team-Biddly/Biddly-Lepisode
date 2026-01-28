/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { NHNCloudObjectStorageModuleConfig } from './nhn-cloud-object-storage.module.type';
import { NHN_CLOUD_OBJECT_STORAGE_MODULE_CONFIG } from './nhn-cloud-object-storage.module.const';

@Injectable()
export class NHNCloudObjectStorageService implements OnModuleInit {
  private readonly logger = new Logger(NHNCloudObjectStorageService.name);

  private token?: string;
  private expiresAt?: Date;
  private endpoint?: string;
  private tokenEndpoint?: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(NHN_CLOUD_OBJECT_STORAGE_MODULE_CONFIG)
    private options: NHNCloudObjectStorageModuleConfig,
  ) {
    setInterval(() => {
      if (this.expiresAt && dayjs().isAfter(this.expiresAt)) {
        this.getToken();
      }
    }, 2000);
  }

  async onModuleInit() {
    await this.validateOptions();
    await this.getToken();
  }

  /**
   * 파일 모듈의 옵션을 검증합니다.
   */
  async validateOptions() {
    const { tenantId, username, password, endpoint, tokenEndpoint } =
      this.options;
    if (!tenantId)
      throw Error(
        'NHN_CLOUD_OBJECT_STORAGE_TENANT_ID 값이 정의되지 않았습니다.',
      );
    if (!username)
      throw Error(
        'NHN_CLOUD_OBJECT_STORAGE_USERNAME 값이 정의되지 않았습니다.',
      );
    if (!password)
      throw Error(
        'NHN_CLOUD_OBJECT_STORAGE_PASSWORD 값이 정의되지 않았습니다.',
      );
    if (!endpoint)
      throw Error(
        'NHN_CLOUD_OBJECT_STORAGE_ENDPOINT 값이 정의되지 않았습니다.',
      );
    if (!tokenEndpoint)
      throw Error(
        'NHN_CLOUD_OBJECT_STORAGE_TOKEN_ENDPOINT 값이 정의되지 않았습니다.',
      );
    this.endpoint = endpoint;
    this.tokenEndpoint = tokenEndpoint;
  }

  /**
   * NHN Cloud Object Storage 토큰을 발급받습니다.
   */
  private async getToken() {
    const { tenantId, username, password } = this.options;
    try {
      const { data } = await this.httpService.axiosRef.post<{
        access: {
          token: {
            id: string;
            tenant: {
              id: string;
            };
            expires: string;
            user: { id: string };
          };
        };
      }>(
        this.tokenEndpoint!,
        {
          auth: {
            tenantId,
            passwordCredentials: {
              username,
              password,
            },
          },
        },
        { headers: { 'Content-Type': 'application/json' } },
      );

      this.token = data.access.token.id;
      this.expiresAt = dayjs(data.access.token.expires).toDate();
      this.logger.log(
        `✅ NHN Cloud Object Storage 토큰을 발급받았습니다. (만료일: ${this.expiresAt})`,
      );
    } catch (error: any) {
      console.error(error.response.data);
      throw new Error('토큰 발급 중 오류가 발생했습니다.');
    }
  }

  /**
   * 컨테이너의 존재 여부를 확인합니다.
   * @param name
   * @returns {Promise<boolean>} 컨테이너가 존재하면 true, 존재하지 않으면 false를 반환합니다.
   
   */
  private async checkContainer(name: string): Promise<boolean> {
    return await new Promise<boolean>((resolve, reject) => {
      this.httpService
        .get<{ name: string }[]>(`${this.endpoint}`, {
          headers: {
            'X-Auth-Token': this.token,
          },
        })
        .subscribe({
          next: (response) => {
            const containers = response.data;
            const exists = containers.some(
              (container) => container.name === name,
            );
            resolve(exists);
          },
          error: (err) => {
            this.logger.error(err);
            reject(
              new BadGatewayException('버킷 확인 중 오류가 발생했습니다.', err),
            );
          },
        });
    });
  }

  /**
   * 컨테이너를 생성합니다.
   * @param container
   */
  private async createContainer(name: string) {
    await new Promise<void>((resolve, reject) => {
      this.httpService
        .put(`${this.endpoint}/${name}`, null, {
          headers: {
            'X-Auth-Token': this.token,
            'X-Container-Read': '.r:*, .rlistings',
          },
        })
        .subscribe({
          next: () => {
            this.logger.log(`✅ 버킷 '${name}'을 생성했습니다.`);
            resolve();
          },
          error: (err) => {
            reject(
              new BadGatewayException('버킷 생성 중 오류가 발생했습니다.', err),
            );
          },
        });
    });
  }

  /**
   * 파일을 업로드 합니다.
   * @returns  업로드된 파일 정보
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async upload(
    containerName: string,
    file: Express.Multer.File,
  ): Promise<{
    url: string;
    name: string;
    size: number;
  }> {
    if (!this.token || !this.expiresAt) {
      await this.getToken();
    }

    if (dayjs().isAfter(this.expiresAt)) {
      await this.getToken();
    }

    if (!(await this.checkContainer(containerName))) {
      await this.createContainer(containerName);
    }

    const url = `${
      this.endpoint
    }/${containerName}/${dayjs().unix()}_${Buffer.from(
      file.originalname,
      'latin1',
    ).toString('utf-8')}`;

    try {
      await this.httpService.axiosRef.put<void>(url, file.buffer, {
        headers: {
          'X-Auth-Token': this.token,
          'Content-Type': file.mimetype,
        },
      });

      this.logger.debug(
        `✅ 파일 ${dayjs().unix()}_${Buffer.from(
          file.originalname,
          'latin1',
        ).toString('utf-8')}이(가) 업로드되었습니다.`,
      );

      return {
        url,
        name: file.originalname,
        size: file.size,
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('파일 업로드에 실패했습니다.');
    }
  }

  async uploadMany(containerName: string, files: Express.Multer.File[]) {
    return Promise.all(files.map((file) => this.upload(containerName, file)));
  }

  async uploadBuffer(
    buffer: Buffer,
    containerName: string,
    filename: string,
    mimetype: string,
  ): Promise<string> {
    if (!this.token || !this.expiresAt) {
      await this.getToken();
    }

    if (dayjs().isAfter(this.expiresAt)) {
      await this.getToken();
    }

    if (!(await this.checkContainer(containerName))) {
      await this.createContainer(containerName);
    }

    const url = `${this.endpoint}/${containerName}/${filename}`;

    try {
      await this.httpService.axiosRef.put<void>(url, buffer, {
        headers: {
          'X-Auth-Token': this.token,
          'Content-Type': mimetype,
        },
      });

      this.logger.debug(`✅ 파일 ${filename}이(가) 업로드되었습니다.`);

      return url;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('파일 업로드에 실패했습니다.');
    }
  }

  /**
   * 파일을 삭제합니다.
   * @param {string} url 삭제할 파일의 URL
   * @see https://docs.nhncloud.com/ko/Storage/Object%20Storage/ko/api-guide/#_68
   
   */
  async delete(url: string): Promise<void> {
    /** 파일의 존재 여부를 확인합니다. */
    try {
      await this.httpService.axiosRef.head(url);
    } catch (error) {
      throw new BadRequestException('존재하지 않는 파일입니다.');
    }

    /** 파일을 삭제합니다. */
    try {
      await this.httpService.axiosRef.delete(url, {
        headers: {
          'X-Auth-Token': this.token,
        },
      });
      this.logger.debug(
        `✅ 파일 ${url.split('/').pop()}이(가) 삭제되었습니다.`,
      );
    } catch (err) {
      throw new BadGatewayException('파일을 삭제하던 중 오류가 발생했습니다.');
    }
  }

  async deleteMany(urls: string[]) {
    await Promise.all(urls.map((url) => this.delete(url)));
  }
}
