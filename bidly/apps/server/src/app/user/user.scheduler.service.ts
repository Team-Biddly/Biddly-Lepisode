import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Events } from '../../libs/consts/events.const';
import { PrismaService } from '../../prisma/prisma.service';
import { SettingService } from '../setting/setting.service';

@Injectable()
export class UserSchedulerService {
  private readonly logger = new Logger(UserSchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly settingService: SettingService,
  ) {}

  /**
   * 재가입 기간이 만료된 사용자를 삭제합니다.
   */
  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async deleteExpiredUsers() {
    const withdrawnExpiry = await this.settingService.get(
      'PRIVACY:USER_WITHDRAWN_PERIOD',
    );

    if (!withdrawnExpiry.value) {
      this.logger.debug(
        '재가입 기간이 설정되어 있지 않아, 스케쥴러를 종료합니다.',
      );
      return;
    }

    const users = await this.prisma.user.findMany({
      where: {
        withdrawnLogs: {
          some: {
            until: {
              lte: new Date(),
            },
          },
        },
      },
    });

    if (users.length > 0) {
      this.logger.debug('개인 정보 파기 시작');
      const deleted = await this.prisma.user.deleteMany({
        where: {
          id: { in: users.map((user) => user.id) },
        },
      });

      await this.prisma.backgroundTaskLog.create({
        data: {
          name: '개인 정보 파기',
          description: `재가입 기간이 만료된 사용자를 ${deleted.count}명 삭제했습니다.`,
        },
      });

      this.logger.debug(
        `재가입 기간이 만료된 사용자를 ${deleted.count}명 삭제했습니다.`,
      );

      this.eventEmitter.emit(Events.USER_DELETED_BATCH, deleted.count);
      return;
    }

    this.logger.debug('재가입 기간이 만료된 사용자가 없습니다.');
  }

  /**
   * 차단 기간이 만료된 사용자를 차단 해제합니다.
   */
  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async unblockUsers() {
    const blockedExpiry = await this.settingService.get(
      'PRIVACY:USER_BLOCKED_PERIOD',
    );

    if (!blockedExpiry.value) {
      this.logger.debug(
        '차단 기간이 설정되어 있지 않아 스케쥴러를 종료합니다.',
      );
      return;
    }

    const users = await this.prisma.user.findMany({
      where: {
        blockLogs: {
          some: {
            until: {
              lte: new Date(),
            },
          },
        },
      },
    });

    if (users.length > 0) {
      this.logger.debug(`차단 해제 시작`);
      const updated = await this.prisma.userBlockLog.deleteMany({
        where: {
          userId: { in: users.map((user) => user.id) },
        },
      });

      await this.prisma.backgroundTaskLog.create({
        data: {
          name: '차단 해제',
          description: `차단 기간이 만료된 사용자를 ${updated.count}명 차단 해제했습니다.`,
        },
      });

      this.logger.debug(
        `차단 기간이 만료된 사용자를 ${updated.count}명 차단 해제했습니다.`,
      );

      this.eventEmitter.emit(Events.USER_UNBLOCKED_BATCH, updated.count);
      return;
    }

    this.logger.debug('차단 기간이 만료된 사용자가 없습니다.');
  }
}
