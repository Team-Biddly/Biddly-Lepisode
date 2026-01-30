import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SetSettingDTO } from './dtos/update-setting.dto';
import { DefaultSettings, SettingKeys } from './setting.const';
import { SETTING_MODULE_CONFIG } from './setting.module.const';
import { SettingModuleConfig } from './setting.module.type';

@Injectable()
export class SettingService implements OnModuleInit {
  private readonly logger = new Logger(SettingService.name);

  constructor(
    @Inject(SETTING_MODULE_CONFIG)
    private readonly config: SettingModuleConfig,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    const settings = DefaultSettings;

    if (this.config.settings) {
      Object.entries(this.config.settings).forEach(([key, value]) => {
        settings[key] = value;
      });
    }

    if (this.config.disabled) {
      Object.entries(this.config.disabled).forEach(([key, value]) => {
        if (this.config.disabled[key] && value === true) {
          settings[key] = null;
        }
      });
    }

    Object.entries(settings).forEach(async ([key, value]) => {
      await this.prisma.setting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      });
    });

    this.logger.debug('기본 설정이 초기화되었습니다.');
  }

  getAll() {
    return this.prisma.setting.findMany();
  }

  get(key: SettingKeys) {
    return this.prisma.setting.findUnique({
      where: {
        key,
      },
    });
  }

  async set(data: SetSettingDTO[]) {
    return await Promise.all(
      data.map((datum) => this.upsertSetting(datum.key, datum.value)),
    );
  }

  private async upsertSetting(key: SettingKeys, value: string) {
    return this.prisma.setting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }
}
