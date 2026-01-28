import { PutObjectCommandInput, S3 } from '@aws-sdk/client-s3';
import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { File, Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import dayjs from 'dayjs';
import { readFileSync, rmSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileCreateDTO } from './dtos/file.create.dto ';
import { FileDeleteDTO } from './dtos/file.delete.dto';
import { FileDTO } from './dtos/file.dto';
import { FileSearchResponseDTO } from './dtos/file.search-response.dto';
import { FileSearchDTO } from './dtos/file.search.dto';
import { STORAGE_MODULE_CONFIG } from './storage.module.const';
import { StorageModuleConfig } from './storage.module.type';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);

  constructor(
    @Inject(STORAGE_MODULE_CONFIG)
    private readonly options: StorageModuleConfig,
    private readonly prisma: PrismaService,
  ) {
    if (!this.options.accessKey)
      throw new Error('Access Key ID가 설정되지 않았습니다.');
    if (!this.options.secretKey)
      throw new Error('Secret Access Key가 설정되지 않았습니다.');
    if (!this.options.bucketName)
      throw new Error('기본 버킷이 설정되지 않았습니다.');
    if (!this.options.endpoint)
      throw new Error('Endpoint가 설정되지 않았습니다.');
  }

  private readonly s3Client = new S3({
    endpoint: this.options.endpoint,
    region: this.options.region,
    forcePathStyle: true,
    credentials: {
      accessKeyId: this.options.accessKey,
      secretAccessKey: this.options.secretKey,
    },
  });

  async onModuleInit() {
    const bucketExists = await this.s3Client
      .headBucket({ Bucket: this.options.bucketName })
      .then(() => true)
      .catch(() => false);
    if (!bucketExists) {
      await this.s3Client.createBucket({ Bucket: this.options.bucketName });

      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: '*',
            Action: 's3:GetObject',
            Resource: `arn:aws:s3:::${this.options.bucketName}/*`,
          },
        ],
      };

      await this.s3Client.putBucketPolicy({
        Bucket: this.options.bucketName,
        Policy: JSON.stringify(policy),
      });
    }

    this.logger.log('Storage module initialized successfully.');
  }

  async upload(file: Express.Multer.File, bucket?: string): Promise<FileDTO> {
    const files = Array.isArray(file) ? file : [file];
    const targetBucket = bucket || this.options.bucketName;
    const createdFiles: File[] = [];

    for (const file of files) {
      // 파일 버퍼 가져오기 (path가 있으면 파일 읽기, 없으면 buffer 사용)
      const buffer = file.buffer
        ? file.buffer
        : file.path
          ? readFileSync(file.path)
          : null;
      if (!buffer) {
        throw new BadRequestException('파일 데이터를 찾을 수 없습니다.');
      }

      // 파일명에서 확장자 분리하고 한글 및 공백 처리
      const originalName = Buffer.from(file.originalname, 'latin1').toString(
        'utf8',
      );
      const fileExtension = extname(originalName).substring(1); // remove the dot
      const filenameWithoutExtension = originalName.replace(
        new RegExp(`\\.${fileExtension}$`),
        '',
      );

      // 고유한 파일명 생성: 원본이름_날짜시간_UUID.확장자
      const uniqueSuffix = `${uuidv4().substring(0, 8)}`;
      const filename = `${filenameWithoutExtension}_${uniqueSuffix}.${fileExtension}`;

      const param: PutObjectCommandInput = {
        Bucket: targetBucket,
        Key: filename,
        Body: buffer,
        ContentType: file.mimetype,
      };

      try {
        await this.s3Client.putObject(param);
        const url = `${this.options.endpoint}/${targetBucket}/${filename}`;

        const createdFile = await this.prisma.file.create({
          data: {
            name: filename,
            url,
            size: file.size,
            mimeType: file.type || file.mimetype,
          },
        });

        createdFiles.push(createdFile);

        // 파일이 디스크에 저장된 경우에만 삭제 시도
        if (file.path) {
          try {
            rmSync(file.path, { force: true }); // 파일 업로드 후 임시 파일 삭제
          } catch (err) {
            this.logger.warn('임시 파일 삭제 실패', err);
          }
        }
      } catch (error) {
        this.logger.error('파일 업로드에 실패했습니다.', error);
        throw new BadGatewayException('파일 업로드에 실패했습니다.');
      }
    }

    if (createdFiles.length === 0) {
      throw new BadRequestException('파일 업로드 실패');
    }

    return plainToInstance(
      FileDTO,
      createdFiles.length === 1 ? createdFiles[0] : createdFiles,
    );
  }

  async findByUrl(url: string) {
    const file = await this.prisma.file.findUnique({
      where: { url },
    });
    if (!file) throw new NotFoundException('파일을 찾을 수 없습니다.');
    return file;
  }

  /**
   * 파일을 업로드합니다.
   * @param {FileCreateDTO} data
   * @returns {Promise<FileDTO[]>}
   */
  async uploadMany(data: FileCreateDTO): Promise<FileDTO[]> {
    const { containerName, files } = data;

    const result: File[] = [];
    for (const file of files) {
      // 파일명에서 확장자 분리하고 한글 및 공백 처리
      const originalName = Buffer.from(file.originalname, 'latin1').toString(
        'utf8',
      );
      const fileExtension = extname(originalName);
      const filenameWithoutExtension = originalName.replace(fileExtension, '');

      // 고유한 파일명 생성: 원본이름_날짜시간_UUID.확장자
      const uniqueSuffix = `${dayjs().format('YYYYMMDDHHmmss')}_${uuidv4().substring(0, 8)}`;
      const safeFileName = `${filenameWithoutExtension}_${uniqueSuffix}${fileExtension}`;

      const params = {
        Bucket: this.options.bucketName,
        Key: `${containerName}/${safeFileName}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      await this.s3Client.putObject(params);

      let endpoint = this.options.endpoint;
      const nhnCloudStorageEndpoint = process.env.NHN_CLOUD_STORAGE_ENDPOINT;
      if (process.env.NODE_ENV === 'production' && nhnCloudStorageEndpoint) {
        endpoint = `${this.options.endpoint}/${nhnCloudStorageEndpoint}`;
      }

      const fileUrl = `${endpoint}/${this.options.bucketName}/${params.Key}`;

      const created = await this.prisma.file.create({
        data: {
          name: safeFileName,
          url: fileUrl,
          size: file.size,
        },
      });

      if (data.modelName && data.modelId) {
        await this.prisma.file.update({
          where: { id: created.id },
          data: {
            [data.modelName]: {
              connect: {
                id: data.modelId,
              },
            },
          },
        });
      }

      result.push(created);
    }

    this.logger.log(
      `파일 ${files.length}개 업로드 완료: ${files.map((f) => f.originalname).join(', ')}`,
    );

    return plainToInstance(FileDTO, result);
  }

  /**
   * 여러 파일을 삭제합니다.
   * @param {FilesDeleteDTO} data
   */
  async deleteMany(data: FileDeleteDTO) {
    const files = await this.prisma.file.findMany({
      where: { url: { in: data.urls } },
      select: { url: true },
    });

    if (files.length === 0) throw new Error('파일을 찾을 수 없습니다.');

    await Promise.all(
      files.map(async (file) => {
        try {
          const filePath = file.url.split(this.options.endpoint)[1];
          await this.s3Client.deleteObject({
            Bucket: this.options.bucketName,
            Key: filePath,
          });
        } catch (error) {
          throw new BadRequestException('파일 삭제에 실패했습니다.');
        }
      }),
    );

    return await this.prisma.file.deleteMany({
      where: {
        url: {
          in: data.urls,
        },
      },
    });
  }

  /**
   * @name getFileStorageConfig
   * @description Multer 디스크 스토리지 설정을 반환합니다.
   * @returns {diskStorage} Multer 디스크 스토리지 설정
   */
  getFileStorageConfig() {
    return diskStorage({
      destination: join(__dirname, './assets'),
      filename: (req, file, callback) => {
        const fileExtName = extname(file.originalname);
        const originalNameEncoded = Buffer.from(
          file.originalname,
          'latin1',
        ).toString('utf8');
        // 고유한 파일명 생성: 원본이름_날짜시간_UUID.확장자
        const uniqueSuffix = `${dayjs().format('YYYYMMDDHHmmss')}_${uuidv4().substring(0, 8)}`;
        const uniqueFileName = `${originalNameEncoded.replace(fileExtName, '')}_${uniqueSuffix}${fileExtName}`;
        callback(null, uniqueFileName);
        file.originalname = originalNameEncoded;
      },
    });
  }

  /**
   * @name search
   * @description Search files
   * @param {FileSearchDTO} option
   * @returns {Promise<FileSearchResponseDTO>}
   */
  async search(option: FileSearchDTO): Promise<FileSearchResponseDTO> {
    const { pageNo, pageSize, query, orderBy, align, columnId, columnName } =
      option;

    const where: Prisma.FileWhereInput = {};
    const AND: Prisma.FileWhereInput[] = [];

    if (query) {
      AND.push({
        OR: [
          {
            title: {
              contains: query,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            name: {
              contains: query,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      });
    }

    if (columnId) {
      AND.push({
        [columnName as keyof typeof Prisma.FileScalarFieldEnum]: {
          equals: columnId,
        },
      });
    }

    if (AND.length) where.AND = AND;

    const skip = (pageNo - 1) * pageSize;
    const take = pageSize;

    const entities = await this.prisma.file.findMany({
      where,
      skip,
      take,
      orderBy: {
        [orderBy || Prisma.FileScalarFieldEnum.createdAt]:
          align || Prisma.SortOrder.desc,
      },
      select: {
        id: true,
        title: true,
        url: true,
        mimeType: true,
        size: true,
        name: true,
        [columnName as keyof typeof Prisma.FileScalarFieldEnum]: true,
      },
    });

    const totalItems = await this.prisma.file.count({ where });

    const items = entities.map((item, index) => ({
      ...item,
      rowNumber: skip + index + 1,
    }));

    const result = new FileSearchResponseDTO();
    result.items = plainToInstance(FileDTO, items);
    result.pageInfo = {
      pageNo,
      pageSize,
      pageItems: items.length,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    };

    return result;
  }

  /**
   * @name findById
   * @param {string} id
   * @returns {Promise<FileDTO>}
   */
  async findById(id: string): Promise<FileDTO> {
    const file = await this.prisma.file.findUnique({
      where: { id },
    });

    if (!file) throw new NotFoundException(`File with ID ${id} not found`);

    return plainToInstance(FileDTO, file);
  }
}
