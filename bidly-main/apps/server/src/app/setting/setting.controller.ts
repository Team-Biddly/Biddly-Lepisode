import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SettingService } from './setting.service';
import { SetSettingDTO } from './dtos/update-setting.dto';
import { SettingDTO } from './dtos/setting.dto';

@ApiTags('Setting')
@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  @ApiOperation({
    summary: '설정값을 조회',
    description: '설정값을 조회합니다.',
  })
  @ApiOkResponse({
    type: SettingDTO,
    isArray: true,
  })
  async getSettings() {
    return this.settingService.getAll();
  }

  @Patch()
  @ApiOperation({
    summary: '설정값을 변경',
    description: '설정값을 변경합니다.',
  })
  @ApiBody({
    type: SetSettingDTO,
    isArray: true,
  })
  @ApiOkResponse()
  async setSettings(@Body() data: SetSettingDTO[]) {
    return this.settingService.set(data);
  }
}
