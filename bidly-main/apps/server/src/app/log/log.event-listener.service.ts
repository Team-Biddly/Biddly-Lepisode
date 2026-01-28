import { Injectable } from '@nestjs/common';
import { LogService } from './log.service';
import { OnEvent } from '@nestjs/event-emitter';
import { Events } from '../../libs';

@Injectable()
export class LogEventListenerService {
  constructor(private readonly logService: LogService) {}
  /**
   * 사용자 생성 이벤트를 수신합니다.
   * @param payload
   */
  @OnEvent(Events.USER_CREATED)
  async handleUserCreatedEvent(payload: { userId: string }) {
    const { userId } = payload;

    await this.logService.create({
      content: '사용자가 생성 되었습니다.',
      targetModel: 'User',
      targetId: userId,
      action: 'CREATE',
    });
  }

  /**
   * 사용자 차단 이벤트를 수신합니다.
   * @param payload
   */
  @OnEvent(Events.USER_BLOCKED)
  async handleUserBlockedEvent(payload: { userId: string; adminId: string }) {
    const { userId, adminId } = payload;

    await this.logService.create({
      content: '사용자가 차단 되었습니다.',
      targetModel: 'User',
      targetId: userId,
      action: 'UPDATE',
      adminId,
    });
  }

  /**
   * 사용자 차단해제 이벤트를 수신합니다.
   * @param payload
   */
  @OnEvent(Events.USER_UNBLOCKED)
  async handleUserUnBlockedEvent(payload: { userId: string; adminId: string }) {
    const { userId, adminId } = payload;

    await this.logService.create({
      content: '사용자 차단이 해제 되었습니다.',
      targetModel: 'User',
      targetId: userId,
      action: 'UPDATE',
      adminId,
    });
  }

  /**
   * 사용자 탈퇴됩니다.
   * @param payload
   */
  @OnEvent(Events.USER_WITHDRAWN)
  async handleUserWithdrawnEvent(payload: { userId: string }) {
    const { userId } = payload;

    await this.logService.create({
      content: '사용자가 탈퇴 되었습니다.',
      targetModel: 'User',
      targetId: userId,
      action: 'UPDATE',
    });
  }

  /**
   * 관리자 로그인 이벤트를 수신합니다.
   * @param payload
   */
  @OnEvent(Events.ADMIN_LOGGED_IN)
  async handleAdminLoggedInEvent(payload: { adminId: string }) {
    const { adminId } = payload;

    await this.logService.create({
      content: '관리자가 로그인 되었습니다.',
      targetModel: 'Admin',
      targetId: adminId,
      action: 'UPDATE',
    });
  }

  /**
   * 관리자 차단 이벤트를 수신합니다.
   * @param payload
   */
  @OnEvent(Events.ADMIN_BLOCKED)
  async handleAdminBlockedEvent(payload: {
    adminId: string;
    superAdminId: string;
  }) {
    const { adminId, superAdminId } = payload;

    await this.logService.create({
      content: '관리자가 차단 되었습니다.',
      targetModel: 'Admin',
      targetId: adminId,
      action: 'UPDATE',
      adminId: superAdminId,
    });
  }

  /**
   * 관리자 차단 해제 이벤트를 수신합니다.
   * @param payload
   */
  @OnEvent(Events.ADMIN_UNBLOCKED)
  async handleAdminUnBlockedEvent(payload: {
    adminId: string;
    superAdminId: string;
  }) {
    const { adminId, superAdminId } = payload;

    await this.logService.create({
      content: '관리자 차단이 해제 되었습니다.',
      targetModel: 'Admin',
      targetId: adminId,
      action: 'UPDATE',
      adminId: superAdminId,
    });
  }
}
