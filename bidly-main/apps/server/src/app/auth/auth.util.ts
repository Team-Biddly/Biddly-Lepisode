import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';
import { Request } from 'express';
import { TokenExpiredException } from './exception/token-expired.exception';

@Injectable()
export class AuthUtil {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * 토큰을 발급합니다.
   * @param {T} payload
   * @returns {string} expiresIn
   * @author 최강훈 <ganghun@lepisode.team>
   * @since 1.0.0
   */
  createToken<T extends object>(payload: T, expiresIn: any): string {
    return this.jwtService.sign<T>(payload, {
      expiresIn,
    });
  }

  /**
   * 토큰을 검증합니다.
   * @param token
   * @returns
   */
  verifyToken<T extends object>(token: string): T {
    try {
      return this.jwtService.verify<T>(token);
    } catch (error) {
      switch (error.message) {
        case 'jwt expired':
          throw new TokenExpiredException();
        case 'jwt malformed':
        case 'invalid signature':
        case 'invalid token':
          throw new BadRequestException('잘못된 요청입니다.1');
        default:
          throw new BadRequestException('잘못된 요청입니다.2');
      }
    }
  }

  /**
   * 평문과 암호화된 문자열을 비교합니다.
   * @param {string} plain
   * @param {string} hash
   * @returns {boolean} isSame
   * @author 최강훈 <ganghun@lepisode.team>
   */
  compareHash(plain: string, hash: string): boolean {
    return compareSync(plain, hash);
  }

  /**
   * 헤더에서 엑세스 토큰을 추출합니다.
   * @param request
   * @returns {string | null} 엑세스 토큰
   */
  extractAccessTokenFromHeader(request: Request): string | null {
    const authorization = request.headers['authorization'];
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return null;
    }
    return authorization.split(' ')[1];
  }

  /**
   * 헤더에서 리프레시 토큰을 추출합니다.
   * @param request
   * @returns {string | null} 리프레시 토큰
   */
  extractRefreshTokenFromHeader(request: Request): string | null {
    const refreshToken = request.headers['x-refresh-token'];
    if (!refreshToken) {
      return null;
    }
    return refreshToken as string;
  }

  /**
   * 헤더에서 쿠키를 추출합니다.
   * @param request
   * @returns { { [key: string]: string } } 쿠키 객체
   */
  extractCookiesFromHeader(request: Request): { [key: string]: string } {
    return request.headers.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key.trim()] = value;
      return acc;
    }, {});
  }
}
