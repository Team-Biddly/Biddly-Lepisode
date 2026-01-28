import { LOG_ACTION } from '@prisma/client';

export class CreateLogDTO {
  /**
   * @description 로그 내용
   * @example '로그 내용'
   */
  content: string;

  /**
   * @description 로그 대상 모델
   * @example 'admin'
   */
  targetModel: string;

  /**
   * @description 로그 대상 ID
   * @example 'adminId'
   */
  targetId: string;

  /**
   * @description 로그 대상 모델
   * @example 'admin'
   */
  targetChildModel?: string;

  /**
   * @description 로그 대상 ID
   * @example 'adminId'
   */
  targetChildId?: string;

  /**
   * @description 관리자 ID
   * @example 'adminId'
   */
  adminId?: string;

  /**
   * @description 사용자 ID
   * @example 'userId'
   */
  userId?: string;

  /**
   * @description 로그 액션
   * @example 'CREATE'
   */
  action: LOG_ACTION;
}
