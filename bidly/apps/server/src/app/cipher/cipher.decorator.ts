import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { CipherService } from './cipher.service';

const cipherService = new CipherService({
  iv: process.env.IV,
  key: process.env.SYMMETRIC_KEY,
});

/**
 * 암호화 데코레이터
 * @description DTO의 특정 필드를 암호화합니다. Create, Update DTO의 필드에 사용합니다.
 */
export const Encrypt = () => {
  return applyDecorators(
    Transform(({ value }) => {
      if (!value) return value;

      if (typeof value === 'object') {
        return cipherService.encrypt(JSON.stringify(value));
      }

      return cipherService.encrypt(value);
    }),
  );
};

/**
 * 복호화 데코레이터
 * @description DTO의 특정 필드를 복호화합니다. Response DTO의 필드에 사용합니다.
 */
export const Decrypt = () => {
  return applyDecorators(
    Transform(({ value }) => {
      if (!value) return value;

      if (typeof value === 'object') {
        return JSON.parse(cipherService.decrypt(value));
      }

      return cipherService.decrypt(value);
    }),
  );
};
