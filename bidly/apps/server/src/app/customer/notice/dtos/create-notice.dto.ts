import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateNoticeDTO {
  @ApiProperty({
    description: '제목',
  })
  @IsNotEmpty({ message: '제목을 입력해 주세요.' })
  title: string;

  @ApiProperty({
    description: '내용',
  })
  @IsNotEmpty({ message: '내용을 입력해 주세요.' })
  content: string;

  @ApiProperty({
    description: '고정',
    type: Boolean,
  })
  @IsNotEmpty({ message: '고정 여부를 선택해 주세요.' })
  isPinned: boolean;
}
