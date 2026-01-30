import {
  BadRequestException,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, Task, TaskStatus } from '@prisma/client';
import { CursorPaginationDTO } from '../../libs/dtos/cursor-pagination.dto';
import { OffsetPaginationDTO } from '../../libs/dtos/offset-pagination.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { CronService } from '../cron/cron.service';
import { CreateTaskDTO } from './dtos/create-task.dto';
import {
  TaskCursorSearchOptionDTO,
  TaskSearchOffsetOptionDTO,
} from './dtos/search-task.dto';
import { UpdateTaskDTO } from './dtos/update-task.dto';

@Injectable()
export class TaskService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cron: CronService,
  ) {}

  async onModuleInit() {
    // @todo initialize cron jobs
  }

  async onModuleDestroy() {
    this.cron.clear();
  }

  /**
   * 스케쥴 작업을 오프셋 기반으로 조회합니다.
   * @param {TaskSearchOffsetOptionDTO} option 오프셋 기반 작업 검색 옵션
   * @returns {Promise<OffsetPaginationDTO>} 오프셋 기반 작업 정보
   */
  async searchOffset(
    option: TaskSearchOffsetOptionDTO,
  ): Promise<OffsetPaginationDTO<Task>> {
    const { pageNo, pageSize, query, orderBy, align } = option;

    const where: Prisma.TaskWhereInput = {}; // @todo: 검색 조건 추가

    if (query) where.OR = [{ name: { contains: query } }];

    const items = await this.prisma.task.findMany({
      where,
      orderBy: { [orderBy || 'createdAt']: align || 'desc' },
      take: pageSize,
      skip: (pageNo - 1) * pageSize,
    });

    const count = await this.prisma.task.count({ where });

    return {
      items,
      pageInfo: {
        pageNo: option.pageNo,
        pageSize: option.pageSize,
        totalPages: Math.ceil(count / option.pageSize),
        totalItems: count,
        pageItems: items.length,
      },
    };
  }

  /**
   * 스케쥴 작업을 커서 기반으로 조회합니다.
   * @param {TaskCursorSearchOptionDTO} option 커서 기반 작업 검색 옵션
   * @returns {Promise<CursorPaginationDTO>} 커서 기반 작업 정보
   */
  async searchCursor(
    option: TaskCursorSearchOptionDTO,
  ): Promise<CursorPaginationDTO<Task>> {
    const { cursor, pageSize, query, orderBy, align } = option;

    const where: Prisma.TaskWhereInput = {}; // @todo: 검색 조건 추가

    if (query)
      where.OR = [
        { name: { contains: query }, description: { contains: query } },
      ];

    const items = await this.prisma.task.findMany({
      where,
      orderBy: { [orderBy || 'createdAt']: align || 'desc' },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
    });

    const hasNext = items.length > pageSize;

    const result = {
      items: items.slice(0, pageSize),
      nextCursor: undefined,
      hasNext,
    };

    if (hasNext) result.nextCursor = items.at(-1)?.id;

    return result;
  }

  /**
   * 스케쥴 작업을 ID 기반으로 조회합니다.
   * @param {string} id 작업 ID
   * @returns {Promise<Task>} 작업 정보
   */
  async findById(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new BadRequestException('작업을 찾을 수 없습니다.');
    }

    return task;
  }

  /**
   * 스케쥴 작업을 생성합니다.
   * @param {CreateTaskDTO} data 생성할 작업 정보
   * @returns {Promise<Task>} 생성된 작업 정보
   */
  async create(data: CreateTaskDTO): Promise<Task> {
    const task = await this.prisma.task.create({
      data: {
        ...data,
        cron: this.cron.format(data.cron),
      },
    });

    this.cron.create({
      id: task.id,
      cron: data.cron,
      callback: data.callback,
    });

    return task;
  }

  /**
   * 스케쥴 작업을 중지합니다.
   * @param {string} id 작업 ID
   * @returns {Promise<Task>} 중지된 작업 정보
   */
  async stop(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new BadRequestException('작업을 찾을 수 없습니다.');
    }

    this.cron.stop(id);

    return this.prisma.task.update({
      where: { id },
      data: { status: TaskStatus.STOPPED },
    });
  }

  /**
   * 스케쥴 작업을 재시작합니다.
   * @param {string} id 작업 ID
   * @returns {Promise<Task>} 재시작된 작업 정보
   */
  async restart(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new BadRequestException('작업을 찾을 수 없습니다.');
    }

    this.cron.start(id);

    return this.prisma.task.update({
      where: { id },
      data: { status: TaskStatus.RUNNING },
    });
  }

  /**
   * 스케쥴 작업을 수정합니다.
   * @param {string} id 작업 ID
   * @param {UpdateTaskDTO} data 수정할 작업 정보
   * @returns {Promise<Task>} 수정된 작업 정보
   */
  async update(id: string, data: UpdateTaskDTO): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new BadRequestException('작업을 찾을 수 없습니다.');
    }

    /**
     * callback이 존재하는 경우, cron job을 갱신합니다.
     * 그렇지 않은 경우, DB의 데이터만 갱신합니다
     */
    if (data.callback) {
      this.cron.update({
        id,
        cron: data.cron,
        callback: data.callback,
      });
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        ...data,
        cron: this.cron.format(data.cron),
      },
    });
  }

  /**
   * 스케쥴 작업을 삭제합니다.
   * @param {string} id 작업 ID
   * @retuns {Promise<Task>} 삭제된 작업 정보
   */
  async delete(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new BadRequestException('작업을 찾을 수 없습니다.');
    }

    this.cron.remove(id);

    return this.prisma.task.delete({ where: { id } });
  }

  /**
   * 여러 스케쥴 작업을 삭제합니다.
   * @param { DeleteManyTaskDTO } data 삭제할 작업 ID 목록
   * @returns {Promise<Prisma.BatchPayload>} 삭제된 작업 수
   */
  async deleteMany(data: { ids: string[] }) {
    const tasks = await this.prisma.task.findMany({
      where: { id: { in: data.ids } },
    });

    tasks.forEach((task) => {
      this.cron.remove(task.id);
    });

    return this.prisma.task.deleteMany({ where: { id: { in: data.ids } } });
  }
}
