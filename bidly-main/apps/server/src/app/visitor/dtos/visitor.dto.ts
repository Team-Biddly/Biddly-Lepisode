import { IRequestVisitor, IVisitor } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class VisitorDTO implements IVisitor {
  @Expose()
  @ApiProperty({ description: 'ID' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'IP' })
  ip: string;

  @Expose()
  @ApiProperty({ description: '국가' })
  nation: string;

  @Expose()
  @ApiProperty({ description: '도시' })
  city: string;

  @Expose()
  @ApiProperty({ description: '접속 기기' })
  device: string;

  @Expose()
  @ApiProperty({ description: '접속 브라우저' })
  browser: string;

  @Expose()
  @ApiProperty({ description: '접속 운영체제' })
  os: string;

  @Expose()
  @ApiProperty({ description: '접속 페이지' })
  pageUrl: string;

  @Expose()
  @ApiProperty({ description: '유입 경로' })
  @Transform(
    ({ value }) => (value === 'direct' ? '직접 방문' : value) || '직접 방문',
  )
  referrer: string;

  @Expose()
  @ApiProperty({ description: '일시' })
  @Type(() => Date)
  createdAt: Date;
}

export class RequestVisitorDTO implements IRequestVisitor {
  @IsOptional()
  @ApiProperty({ description: '도시' })
  city: string;

  @IsOptional()
  @ApiProperty({ description: 'IPv4' })
  ip: string;

  @IsOptional()
  @ApiProperty({ description: '국가' })
  nation: string;

  @IsOptional()
  @ApiProperty({ description: '접속 페이지' })
  pageUrl: string;

  @IsOptional()
  @ApiProperty({ description: '유입 경로' })
  referrer: string;
}
