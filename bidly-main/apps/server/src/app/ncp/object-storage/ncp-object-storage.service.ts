import { Inject, Injectable } from "@nestjs/common";
import { NCPObjectStorageModuleConfig } from "./ncp-object-storage.module.type";
import * as AWS from "aws-sdk";
import "multer";
import { NCP_OBJECT_STORAGE_MODULE_CONFIG } from "./ncp-object-storage.const";

@Injectable()
export class NCPObjectStorageService {
  private readonly endpoint = "https://kr.object.ncloudstorage.com";

  private S3 = new AWS.S3({
    endpoint: this.endpoint,
    region: "kr-standard",
    credentials: {
      accessKeyId: this.config.accessKey,
      secretAccessKey: this.config.secretKey,
    },
  });

  constructor(
    @Inject(NCP_OBJECT_STORAGE_MODULE_CONFIG)
    private readonly config: NCPObjectStorageModuleConfig,
  ) {}

  private checkBucketExists(bucketName: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.S3.headBucket({ Bucket: bucketName }, (err, data) => {
        if (err) resolve(false);
        resolve(true);
      });
    });
  }

  /**
   * 새 버킷을 생성합니다.
   * @param {string} bucketName
   * @author 최강훈 <ganghun@lepisode.team>
   */
  private createBucket(bucketName: string) {
    return new Promise((resolve, reject) => {
      this.S3.createBucket(
        { Bucket: bucketName, CreateBucketConfiguration: {} },
        (err, data) => {
          if (err) reject(err);
          resolve(data);
        },
      );
    });
  }

  /**
   * 버킷을 삭제합니다.
   * @param {string} bucketName
   * @author 최강훈 <ganghun@lepisode.team>
   */
  private deleteBucket(bucketName: string) {
    return new Promise((resolve, reject) => {
      this.S3.deleteBucket({ Bucket: bucketName }, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  /**
   * 파일을 버킷에 업로드합니다.
   * @param {string} bucketName
   * @param {string} key
   * @param {Express.Multer.File} body
   * @returns {Promise<AWS.S3.PutObjectOutput>} 업로드 결과
   * @author 최강훈 <ganghun@lepisode.team>
   */
  async uploadMany(
    bucketName: string,
    files: Array<Express.Multer.File>,
  ): Promise<{ name: string; size: number; url: string }[]> {
    if (!(await this.checkBucketExists(bucketName))) {
      await this.createBucket(bucketName);
    }

    return Promise.all(
      files.map((file) => {
        return new Promise<{ name: string; size: number; url: string }>(
          (resolve, reject) => {
            this.S3.upload(
              {
                Bucket: bucketName,
                Key: `${new Date().getTime()}_${file.originalname}`,
                Body: file.buffer,
                ACL: "public-read",
              },
              (err, data) => {
                if (err) reject(err);
                resolve({
                  name: file.originalname,
                  size: file.size,
                  url: data.Location,
                });
              },
            );
          },
        );
      }),
    );
  }

  checkFileExists(url: string);
  checkFileExists(bucket: string, key: string);

  checkFileExists(urlOrBucket: string, key?: string) {
    let Bucket: string;
    let Key: string;

    if (key) {
      Bucket = urlOrBucket;
      Key = key;
    } else {
      const bucketNameMatch =
        /https:\/\/([^\.]+)\.kr\.object\.ncloudstorage\.com\//.exec(
          urlOrBucket,
        );
      Bucket = bucketNameMatch ? bucketNameMatch[1] : null;

      // Regular expression to extract the filename
      const fileNameMatch =
        /https:\/\/[^\.]+\.kr\.object\.ncloudstorage\.com\/(.+)/.exec(
          urlOrBucket,
        );
      Key = fileNameMatch ? fileNameMatch[1] : null;
    }

    return new Promise((resolve) => {
      this.S3.headObject({ Bucket, Key }, (err, data) => {
        if (err) resolve(false);
        resolve(true);
      });
    });
  }

  delete(url: string) {
    const bucketNameMatch =
      /https:\/\/([^\.]+)\.kr\.object\.ncloudstorage\.com\//.exec(url);
    const Bucket = bucketNameMatch ? bucketNameMatch[1] : null;

    // Regular expression to extract the filename
    const fileNameMatch =
      /https:\/\/[^\.]+\.kr\.object\.ncloudstorage\.com\/(.+)/.exec(url);
    const Key = fileNameMatch ? fileNameMatch[1] : null;

    if (!Bucket || !Key) {
      return Promise.reject(new Error("잘못된 URL입니다."));
    }

    return new Promise((resolve, reject) => {
      this.S3.deleteObject({ Bucket, Key }, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  deleteMany(urls: string[]) {
    return Promise.all(
      urls.map((url) => {
        return this.delete(url);
      }),
    );
  }
}
