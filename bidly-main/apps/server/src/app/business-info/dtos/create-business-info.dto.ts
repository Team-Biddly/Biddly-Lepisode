import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { FileDTO } from '../../storage/dtos/file.dto';

export class CreateBusinessInfoDTO {
  @IsOptional()
  @ApiPropertyOptional({ description: 'ID', required: false })
  id?: string;

  @IsNotEmpty({ message: '상호명은 필수 사항입니다.' })
  @ApiPropertyOptional({ description: '상호명', required: true })
  businessName: string;

  @IsNotEmpty({ message: '로고는 필수 사항입니다.' })
  @ApiPropertyOptional({ description: '로고', required: true })
  logo: FileDTO;

  @IsNotEmpty({ message: '대표자명은 필수 사항입니다.' })
  @ApiPropertyOptional({ description: '대표자명', required: true })
  representativeName: string;

  @IsNotEmpty({ message: '사업자등록번호는 필수 사항입니다.' })
  @ApiProperty({ description: '사업자등록번호', required: true })
  businessRegistrationNumber: string;

  @IsNotEmpty({ message: '이메일은 필수 사항입니다.' })
  @ApiProperty({ description: '이메일', required: true })
  email: string;

  @IsNotEmpty({ message: '주소는 필수 사항입니다.' })
  @ApiProperty({ description: '주소' })
  address: string;

  @IsNotEmpty({ message: '고객 센터 정보는 필수 사항입니다.' })
  @ApiProperty({ description: '고객 센터' })
  customerServiceCenter: string;

  @IsOptional()
  @Expose()
  @ApiProperty({ description: '등록일', type: Date, required: false })
  @Type(() => Date)
  createdAt?: Date;
}
