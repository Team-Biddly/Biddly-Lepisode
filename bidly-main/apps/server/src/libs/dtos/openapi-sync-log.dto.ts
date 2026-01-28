import { ApiProperty } from '@nestjs/swagger';
import { SyncLog } from '@prisma/client';
import { Expose } from 'class-transformer';

export class OpenAPISyncLogDTO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  type: SyncLog;

  @ApiProperty()
  @Expose()
  duration: number;

  @ApiProperty()
  @Expose()
  entries: number;

  @ApiProperty()
  @Expose()
  apiCalls: number;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
