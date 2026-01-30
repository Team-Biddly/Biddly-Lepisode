// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { Gender, UserRole } from '@prisma/client';
// import { Transform } from 'class-transformer';
// import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
// import dayjs from 'dayjs';
// import { OauthCreateDTO } from '../../oauth/dtos/oauth.create.dto';

// export class UserCreateDTO {
//   @ApiProperty({
//     description: '이름',
//   })
//   @IsNotEmpty({
//     message: '이름을 입력해 주세요.',
//   })
//   @MaxLength(50, {
//     message: '이름은 50자 이내로 입력해 주세요.',
//   })
//   name: string;

//   @ApiPropertyOptional({
//     description: '닉네임',
//     required: false,
//   })
//   @IsOptional()
//   @MaxLength(100, {
//     message: '닉네임은 100자 이내로 입력해 주세요.',
//   })
//   nickname?: string;

//   @ApiPropertyOptional({
//     description: '역할',
//     enum: Object.keys(UserRole),
//     required: false,
//   })
//   @IsOptional()
//   role?: keyof typeof UserRole | null;

//   @ApiPropertyOptional({
//     description: '사용자 연락처',
//     required: false,
//   })
//   @IsOptional()
//   @Transform(({ value }) => value || undefined)
//   contact?: string;

//   @ApiPropertyOptional({
//     description: '사용자 비밀번호',
//     required: false,
//   })
//   @IsOptional()
//   @MaxLength(100)
//   password: string;

//   @ApiPropertyOptional({
//     description: '사용자 비밀번호 확인',
//     required: false,
//   })
//   @IsOptional()
//   @MaxLength(100)
//   confirmedPassword: string;

//   @ApiPropertyOptional({
//     description: '생년월일',
//     required: false,
//   })
//   @IsOptional()
//   @Transform(({ value }) =>
//     value && dayjs(value).isValid() ? dayjs(value).toDate() : undefined,
//   )
//   birth: Date;

//   @ApiPropertyOptional({
//     description: '성별',
//     required: false,
//   })
//   @IsOptional()
//   gender: keyof typeof Gender | undefined | null;

//   @ApiPropertyOptional({
//     description: 'SNS 정보',
//     required: false,
//     type: () => OauthCreateDTO,
//   })
//   @IsOptional()
//   oAuth?: OauthCreateDTO | undefined | null;

//   constructor() {
//     this.name = '';
//     this.profiles = [];
//     this.nickname = '';
//     this.contact = '';
//     this.password = '';
//     this.confirmedPassword = '';
//     this.birth = new Date();
//   }
// }
