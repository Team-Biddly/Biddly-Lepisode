import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class VisitorDeviceTypeDTO {
  @Expose()
  @ApiProperty({ description: '라벨', isArray: true, type: String })
  labels: string[];

  @Expose()
  @ApiProperty({ description: '방문자 수', type: Number, isArray: true })
  @Type(() => Number)
  counts: number[];
}

export class VisitorChartDataDTO {
  @Expose()
  @ApiProperty({ description: '날짜' })
  dates?: string[];

  @Expose()
  @ApiProperty({ description: '접속 페이지' })
  pageUrls?: string[];

  @Expose()
  @ApiProperty({ description: '유입 페이지' })
  referrers?: string[];

  @Expose()
  @ApiProperty({ description: 'OS', type: VisitorDeviceTypeDTO })
  oses?: VisitorDeviceTypeDTO;

  @Expose()
  @ApiProperty({
    description: '브라우저',
    type: VisitorDeviceTypeDTO,
  })
  browsers?: VisitorDeviceTypeDTO;

  @Expose()
  @ApiProperty({
    description: '기기',
    type: VisitorDeviceTypeDTO,
  })
  devices?: VisitorDeviceTypeDTO;

  @Expose()
  @ApiProperty({ description: '방문자 수', type: Number, isArray: true })
  @Type(() => Number)
  counts: number[];
}
