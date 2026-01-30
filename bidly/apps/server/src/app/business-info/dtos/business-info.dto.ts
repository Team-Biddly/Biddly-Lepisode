import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { FileDTO } from '../../storage/dtos/file.dto';

@Exclude()
export class BusinessInfoDTO {
  @Expose()
  @ApiProperty({ description: 'ID' })
  id?: string;

  @Expose()
  @ApiProperty({ description: '상호명' })
  businessName: string;

  @Expose()
  @Type(() => FileDTO)
  @ApiProperty({ description: '로고' })
  logo: FileDTO;

  @Expose()
  @ApiProperty({ description: '대표자명' })
  representativeName: string;

  @Expose()
  @ApiProperty({ description: '사업자등록번호' })
  businessRegistrationNumber: string;

  @Expose()
  @ApiProperty({ description: '이메일' })
  email: string;

  @Expose()
  @ApiProperty({ description: '주소' })
  address: string;

  @Expose()
  @ApiProperty({ description: '고객센터' })
  customerServiceCenter: string;

  @Expose()
  @ApiProperty({ description: '등록일', type: Date })
  @Type(() => Date)
  createdAt?: Date;
}
