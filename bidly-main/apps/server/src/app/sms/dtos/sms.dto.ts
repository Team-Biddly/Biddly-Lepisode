import { ApiProperty } from "@nestjs/swagger";
import { MaxArrayLength } from "../../../libs";
import { MaxLength, MinLength } from "class-validator";

export class SMSDTO {
  @ApiProperty({
    description: "메시지 본문",
    example: "안녕하세요. 반갑습니다.",
    required: true,
  })
  @MinLength(1, { message: "메시지는 최소 1자 이상 입력해야 합니다." })
  @MaxLength(255, {
    message: "메시지는 최대 255자까지 입력 가능합니다.",
  })
  body: string;

  @ApiProperty({
    description: "수신자 전화번호",
    example: "01012345678",
    required: true,
  })
  @MinLength(10, { message: "전화번호는 최소 10자 이상 입력해야 합니다." })
  @MaxLength(11, { message: "전화번호는 최대 11자까지 입력 가능합니다." })
  receiver: string;

  @ApiProperty({
    description: "예약 발송 시각",
    example: "2024-11-28 09:00",
  })
  requestDate?: `${number}-${number}-${number} ${number}:${number}`;
}

export class BatchSMSDTO {
  @ApiProperty({
    description: "메시지 본문",
    example: "안녕하세요. 반갑습니다.",
    required: true,
  })
  @MinLength(1, { message: "메시지는 최소 1자 이상 입력해야 합니다." })
  @MaxLength(255, {
    message: "메시지는 최대 255자까지 입력 가능합니다.",
  })
  body: string;

  @ApiProperty({
    description: "수신자 전화번호 목록",
    example: ["01012345678", "01087654321"],
    isArray: true,
    required: true,
  })
  @MaxArrayLength(100, {
    message: "수신자는 최대 100명까지 입력 가능합니다.",
  })
  receivers: string[];

  @ApiProperty({
    description: "예약 발송 시각",
    example: "2024-11-28 09:00",
    required: false,
  })
  requestDate?: `${number}-${number}-${number} ${number}:${number}`;
}
