import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PreStandardOpinionDTO {
  @ApiProperty()
  사전규격등록번호: string;

  @ApiProperty()
  참조번호: string;

  @ApiProperty()
  @Expose()
  의견번호: string;

  @ApiProperty()
  @Expose()
  답변번호: string;

  @ApiProperty()
  @Expose()
  의견제목: string;

  @ApiProperty()
  @Expose()
  작성업체명: string;

  @ApiProperty()
  @Expose()
  작성자명: string;

  @ApiProperty()
  @Expose()
  입력일시: Date;

  @ApiProperty()
  @Expose()
  작성자전화번호: string;

  @ApiProperty()
  @Expose()
  작성자이메일: string;

  @ApiProperty()
  @Expose()
  규격의견서파일URL: string[];

  @ApiProperty()
  @Expose()
  의견내용: string;
}
