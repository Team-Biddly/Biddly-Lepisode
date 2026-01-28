import { HttpException } from '@nestjs/common';

export class TokenExpiredException extends HttpException {
  constructor() {
    super('요청 시간이 만료되었습니다.', 401);
  }
}
