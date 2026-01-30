import { ApiProperty } from '@nestjs/swagger';
import { UserDTO } from '../../user/dtos/user.dto';
import { Expose, Type } from 'class-transformer';
import { UserLoginState } from '@common';
import { OauthCreateDTO } from './oauth.create.dto';

export class OAuthResponseDTO {
  @Expose()
  @ApiProperty({
    description: '로그인 상태',
    enum: Object.values(UserLoginState),
  })
  state: keyof typeof UserLoginState;

  @Expose()
  @ApiProperty({
    description: '소셜 로그인 회원',
    type: UserDTO,
    nullable: true,
  })
  user?: UserDTO;

  @Expose()
  @ApiProperty({
    description: '소셜 로그인 토큰',
    type: String,
    nullable: true,
  })
  token?:
    | string
    | {
        accessToken: string;
        refreshToken: string;
      };

  @Expose()
  @ApiProperty({
    description: '소셜 로그인 회원가입 정보',
    type: OauthCreateDTO,
    nullable: true,
  })
  @Type(() => OauthCreateDTO)
  signUp?: OauthCreateDTO;
}
