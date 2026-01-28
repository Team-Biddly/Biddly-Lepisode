import { ApiProperty } from '@nestjs/swagger';

export class DeleteManyTaskDTO {
  @ApiProperty({
    description: '삭제할 작업 ID 목록',
    example: ['T00000001', 'T00000002'],
  })
  ids: string[];
}

export class DeleteManyTaskByPeriod {
  @ApiProperty({
    description: '삭제할 작업 생성일 범위 시작일',
    example: '2021-07-01T00:00:00Z',
  })
  startDate: Date;

  @ApiProperty({
    description: '삭제할 작업 생성일 범위 종료일',
    example: '2021-07-31T23:59:59Z',
  })
  endDate: Date;
}
