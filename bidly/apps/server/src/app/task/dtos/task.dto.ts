import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import { CronDTO } from '../../cron/dtos/cron.dto';

export class TaskDTO {
  @ApiProperty({
    description: '작업 ID',
    example: 'T00000001',
  })
  id: string;

  @ApiProperty({
    description: '작업 이름',
    example: '매일 백업',
  })
  name: string;

  @ApiPropertyOptional({
    description: '작업 설명',
    example: '매일 백업을 실행합니다.',
  })
  description?: string;

  @ApiProperty({
    description: '작업 실행 주기 (cron)',
    type: CronDTO,
  })
  cron: CronDTO;

  @ApiProperty({
    description: '작업 상태',
    enum: Object.keys(TaskStatus),
  })
  status: keyof typeof TaskStatus;

  @ApiProperty({
    description: '작업 생성일',
  })
  createdAt: Date;

  @ApiProperty({
    description: '작업 수정일',
  })
  updatedAt: Date;
}
