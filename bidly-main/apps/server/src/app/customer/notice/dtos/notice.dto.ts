import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserDTO } from '../../../user/dtos/user.dto';

@Exclude()
export class NoticeDTO {
  @Expose()
  @ApiProperty({ description: 'rowNumber' })
  rowNumber: string;

  @Expose()
  @ApiProperty({ description: 'ID' })
  id: string;

  @Expose()
  @ApiProperty({ description: '제목' })
  title: string;

  @Expose()
  @ApiProperty({ description: '내용' })
  content: string;

  @Expose()
  @ApiProperty({ description: '핀 고정' })
  isPinned: boolean;

  @Expose()
  @ApiProperty({ description: '등록일', type: Date })
  @Type(() => Date)
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: '작성 관리자', type: () => UserDTO })
  @Type(() => UserDTO)
  admin: UserDTO;
}
