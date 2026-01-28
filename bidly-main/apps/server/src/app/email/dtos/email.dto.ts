import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class EmailRequestDTO {
  @ApiProperty({
    description: "제목",
  })
  @IsNotEmpty({
    message: "제목을 입력해 주세요.",
  })
  title: string;

  @ApiProperty({
    description: "본문",
  })
  @IsNotEmpty({
    message: "본문을 입력해 주세요.",
  })
  body: string;

  @ApiProperty({
    description: "수신 이메일",
  })
  @IsNotEmpty({
    message: "수신 이메일을 입력해 주세요.",
  })
  @IsEmail()
  receiver: string;
}
