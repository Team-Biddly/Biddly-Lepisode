import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv } from 'crypto';
import { CIPHER_MODULE_CONFIG } from './cipher.module.const';
import { CipherModuleConfig } from './cipher.module.type';

@Injectable()
export class CipherService {
  private readonly symmetricKey: Buffer;
  private readonly algorithm: string;
  private readonly iv: Buffer;

  constructor(
    @Inject(CIPHER_MODULE_CONFIG) private readonly config: CipherModuleConfig,
  ) {
    // 필수 환경 변수 체크
    if (!this.config.key)
      throw new BadRequestException(
        '대칭키 환경 변수가 설정되지 않았습니다. 🔑',
      );

    if (!this.config.algorithm) {
      this.algorithm = 'aes-256-ctr'; // 기본 알고리즘
    } else {
      this.algorithm = this.config.algorithm;
    }

    this.symmetricKey = Buffer.from(this.config.key, 'hex');

    // 키의 길이가 32바이트(AES-256)인지 확인
    if (this.symmetricKey.length !== 32)
      throw new BadRequestException(
        '대칭키의 길이는 32바이트(256비트)여야 합니다. 📏',
      );

    if (!this.config.iv)
      throw new BadRequestException('IV가 설정되지 않았습니다. ⚙️');

    this.iv = Buffer.from(this.config.iv, 'base64'); // Base64로 인코딩된 IV를 Buffer로 변환
  }

  /**
   * 대칭키 AES256 알고리즘을 사용하여 암호화합니다. 🔓
   * @param {string | Buffer} text
   * @returns {string}
   */
  encrypt(text: string | Buffer): string {
    if (Buffer.isBuffer(text)) {
      text = text.toString(); // Buffer를 문자열로 변환
    }

    const cipher = createCipheriv(this.algorithm, this.symmetricKey, this.iv);
    const encryptedText = Buffer.concat([cipher.update(text), cipher.final()]);

    return Buffer.concat([this.iv, encryptedText]).toString('base64'); // Base64로 인코딩하여 문자열 반환
  }

  /**
   * 대칭키 AES256 알고리즘을 사용하여 복호화합니다. 🔓
   * @param {string} encryptedData
   * @returns {string}
   */
  decrypt(encryptedData?: string | null | undefined): string {
    if (!encryptedData) return '';

    const dataBuffer = Buffer.from(encryptedData, 'base64'); // Base64를 Buffer로 변환
    const encryptedText = Buffer.from(dataBuffer.subarray(16)); // 나머지가 암호문

    const decipher = createDecipheriv(
      this.algorithm,
      this.symmetricKey,
      this.iv,
    );

    const decryptedText = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);

    return decryptedText.toString(); // 문자열로 반환
  }
}
