import { ApiProperty } from "@nestjs/swagger";
import { DefaultSettings, SettingKeys } from "../setting.const";

export class SetSettingDTO {
  @ApiProperty({
    description: "설정 키",
    enum: Object.keys(DefaultSettings),
  })
  key: SettingKeys;
  @ApiProperty({
    description: "설정 값",
  })
  value: string;
}
