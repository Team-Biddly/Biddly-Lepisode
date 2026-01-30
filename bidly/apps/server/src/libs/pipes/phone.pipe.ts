import { BadRequestException, PipeTransform } from '@nestjs/common';

export class PhonePipe implements PipeTransform {
  /**
   * 전화번호 형식을 검증합니다.
   * 한국 전화 번호 형식으로 01012345678, 0101234567을 허용합니다.
   * @param value (ex. 01012345678, 0101234567)
   * @returns
   */
  transform(value: string) {
    const phoneRegex = /^\d{3}\d{3,4}\d{4}$/;

    if (!phoneRegex.test(value)) {
      throw new BadRequestException('전화번호 형식이 아닙니다.');
    }

    return value;
  }
}
