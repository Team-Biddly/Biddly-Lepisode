import { ApiProperty } from "@nestjs/swagger";
import { Max, Min } from "class-validator";

export class CronDTO {
  @ApiProperty({
    description: "초",
    default: "*",
    example: "0-59",
    nullable: true,
  })
  @Max(59, { message: "최대 59까지 입력 가능합니다." })
  @Min(0, { message: "최소 0부터 입력 가능합니다." })
  second?: number | string = "*";

  @ApiProperty({
    description: "분",
    default: "*",
    example: "0-59",
    nullable: true,
  })
  @Min(0, { message: "최소 0부터 입력 가능합니다." })
  @Max(59, { message: "최대 59까지 입력 가능합니다." })
  minute?: number | string = "*";

  @ApiProperty({
    description: "시",
    default: "*",
    example: "0-23",
    nullable: true,
  })
  @Min(0, { message: "최소 0부터 입력 가능합니다." })
  @Max(23, { message: "최대 23까지 입력 가능합니다." })
  hour?: number | string = "*";

  @ApiProperty({
    description: "일",
    default: "*",
    example: "1-31",
    nullable: true,
  })
  @Min(1, { message: "최소 1부터 입력 가능합니다." })
  @Max(31, { message: "최대 31까지 입력 가능합니다." })
  day?: number | string = "*";

  @ApiProperty({
    description: "월",
    default: "*",
    example: "1-12",
    nullable: true,
  })
  @Min(1, { message: "최소 1부터 입력 가능합니다." })
  @Max(12, { message: "최대 12까지 입력 가능합니다." })
  month?: number | string = "*";

  @ApiProperty({
    description: "요일",
    default: "*",
    example: "0-6",
    nullable: true,
  })
  @Min(0, { message: "최소 0부터 입력 가능합니다." })
  @Max(6, { message: "최대 6까지 입력 가능합니다." })
  dayOfWeek?: number | string = "*";
}
