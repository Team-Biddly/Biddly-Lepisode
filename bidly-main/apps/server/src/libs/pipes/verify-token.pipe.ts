import { Injectable, PipeTransform } from "@nestjs/common";
import { AuthUtil } from "../../app/auth/auth.util";

/**
 * 토큰 검증 파이프
 * Query에서 받은 토큰을 검증합니다.
 * @author 정정용 <jeongyong@lepisode.team>
 */
@Injectable()
export class VerifyTokenPipe<T extends object> implements PipeTransform {
  constructor(private readonly authUtil: AuthUtil) {}

  transform(value: string): T | null {
    if (!value) {
      return null;
    }

    return this.authUtil.verifyToken<T>(value);
  }
}
