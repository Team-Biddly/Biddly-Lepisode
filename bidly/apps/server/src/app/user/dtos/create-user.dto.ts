import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { OauthCreateDTO } from '../../oauth/dtos/oauth.create.dto';

export class CreateUserDTO {
  @ApiProperty({
    example: '홍길동',
    description: '사용자 이름',
    required: true,
  })
  @IsNotEmpty({
    message: '이름을 입력해주세요.',
  })
  @MaxLength(20, {
    message: '이름은 20자 이내로 입력해주세요.',
  })
  name: string;

  @ApiProperty({
    example: '01012345678',
    description: '사용자 연락처',
    required: true,
  })
  @Transform(({ value }) => {
    return value;
  })
  @IsNotEmpty({
    message: '연락처를 입력해주세요.',
  })
  @MaxLength(11, {
    message: '연락처는 11자로 입력해주세요.',
  })
  contact: string;

  @ApiProperty({
    example: 'help@lepisode.team',
    description: '사용자 이메일',
    required: true,
  })
  @IsNotEmpty({
    message: '이메일을 입력해주세요.',
  })
  @IsEmail(
    {
      /**
       * 영어 외의 언어를 로컬 부분에 허용하지 않습니다. (ex. 한글@lepisode.team (x))
       */
      allow_utf8_local_part: false,
    },
    {
      message: '유효한 이메일을 입력해주세요.',
    },
  )
  email: string;

  @ApiPropertyOptional({
    description: '사용자 비밀번호',
    required: false,
  })
  @IsOptional()
  @MaxLength(100)
  password: string;

  @ApiPropertyOptional({
    description: '사용자 비밀번호 확인',
    required: false,
  })
  @IsOptional()
  @MaxLength(100)
  confirmPassword: string;

  @ApiProperty({
    description: '이메일 수신 동의 여부',
    required: false,
  })
  @IsOptional()
  emailConsent?: boolean;

  @ApiProperty({
    description: 'SMS 수신 동의 여부',
    required: false,
  })
  @IsOptional()
  smsConsent?: boolean;

  @ApiProperty({
    description: '약관 전체 동의 여부',
    required: false,
  })
  @IsOptional()
  agreementAll?: boolean;

  @ApiProperty({
    description: '약관 1 동의 여부',
    required: false,
  })
  @IsOptional()
  agreementTerm1?: boolean;

  @ApiProperty({
    description: '약관 2 동의 여부',
    required: false,
  })
  @IsOptional()
  agreementTerm2?: boolean;

  @ApiProperty({
    example: '고길동',
    description: '사용자 닉네임',
    required: false,
  })
  @IsOptional()
  @MaxLength(20, {
    message: '닉네임은 20자 이내로 입력해주세요.',
  })
  nickname?: string;

  @ApiPropertyOptional({
    description: 'SNS 정보',
    required: false,
    type: () => OauthCreateDTO,
  })
  @IsOptional()
  oAuth?: OauthCreateDTO | undefined | null;

  @IsOptional()
  @ApiProperty({
    example: '1',
    description: '권한 ID',
    required: false,
  })
  permissionId: string;
}
