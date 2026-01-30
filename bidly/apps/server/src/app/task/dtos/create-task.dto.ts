import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength } from "class-validator";
import { CronDTO } from "../../cron/dtos/cron.dto";
import { Type } from "class-transformer";

export class CreateTaskDTO {
  @ApiProperty({
    description: "작업 이름",
  })
  @IsNotEmpty({ message: "작업 이름을 입력해주세요." })
  @MaxLength(20, { message: "작업 이름은 20자 이내로 입력해주세요." })
  name: string;

  @ApiProperty({
    description: "작업 설명",
  })
  @IsNotEmpty({ message: "작업 설명을 입력해주세요." })
  @MaxLength(100, { message: "작업 설명은 100자 이내로 입력해주세요." })
  description: string;

  @ApiProperty({
    description: "작업 실행 주기",
    example: CronDTO,
  })
  @IsNotEmpty({ message: "작업 실행 주기를 입력해주세요." })
  @Type(() => CronDTO)
  cron: CronDTO;

  /**
   * @caution API로 전달되지 않는 필드입니다.
   */
  callback: () => void | Promise<void>;
}
