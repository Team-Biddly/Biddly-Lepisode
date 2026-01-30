import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class DeleteManyUserDTO {
  @ApiProperty({
    example: ['1', '2', '3'],
    description: '사용자 ID 배열',
    required: true,
    isArray: true,
  })
  @IsNotEmpty({ message: '삭제할 사용자의 ID 배열을 입력해주세요.' })
  ids: string[];
}

export class DeleteManyUserByPeriodDTO {
  @ApiProperty({
    example: '2024-01-01',
    description: '시작일',
    required: true,
  })
  @IsNotEmpty({ message: '시작일을 입력해주세요.' })
  @IsDateString(
    {},
    {
      message:
        '시작일은 날짜 형식이여야 합니다. (YYYY-MM-DD, YYYY-MM-DDTHH:mm:ss.sssZ)',
    },
  )
  startDate: string;

  @ApiProperty({
    example: '2024-12-31',
    description: '종료일',
    required: true,
  })
  @IsNotEmpty({ message: '종료일을 입력해주세요.' })
  @IsDateString(
    {},
    {
      message:
        '종료일은 날짜 형식이여야 합니다. (YYYY-MM-DD, YYYY-MM-DDTHH:mm:ss.sssZ)',
    },
  )
  endDate: string;
}
