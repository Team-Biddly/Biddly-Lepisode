/**
 * 구글 토큰 요청 응답
 * @see https://developers.google.com/identity/protocols/oauth2/web-server#exchange-authorization-code
 * @author 최강훈 <ganghun@lepisode.team>
 */
export type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  id_token: string;
};
/**
 * 구글 사용자 정보 응답
 * @caution 구글은 사용자의 이름과 연락처를 제공하지 않습니다.
 * @see https://developers.google.com/identity/protocols/oauth2/web-server#callinganapi
 * @author 최강훈 <ganghun@lepisode.team>
 */
export type GoogleAccountResponse = {
  sub: string;
  email: string;
  email_verified: boolean;
  picture: string;
};
