import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class WithdrawUserDTO {
  @ApiProperty({
    description: '탈퇴 사유',
    default: '탈퇴하고 싶습니다.',
  })
  // @IsNotEmpty({
  //   message: "탈퇴 사유를 입력해주세요.",
  // })
  @IsOptional()
  @MaxLength(100, {
    message: '탈퇴 사유는 100자 이내로 입력해주세요.',
  })
  withdrawnReason: string;
}
