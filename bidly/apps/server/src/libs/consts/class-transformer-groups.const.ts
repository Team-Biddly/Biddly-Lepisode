/**
 * DTO 클래스의 권한별 그룹화를 위한 상수
 * @author 정정용 <jeongyong@lepisode.team>
 */
export const TransformGroup = {
  /**
   * 내 정보 접근 권한
   */
  ME: "ME",

  /**
   * 관리자 권한
   */
  ADMIN: "ADMIN",

  /**
   * 사용자 권한
   */
  USER: "USER",
} as const;
