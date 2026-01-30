import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Prisma, TaskStatus } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { ApiCursorPagination } from '../../libs/decorators/cursor-pagination.decorator';
import { ApiOffsetPagination } from '../../libs/decorators/offset-pagination.decorator';
import { CursorPaginationDTO } from '../../libs/dtos/cursor-pagination.dto';
import { OffsetPaginationDTO } from '../../libs/dtos/offset-pagination.dto';
import { DeleteManyTaskDTO } from './dtos/delete-many-task.dto';
import {
  TaskCursorSearchOptionDTO,
  TaskSearchOffsetOptionDTO,
} from './dtos/search-task.dto';
import { TaskDTO } from './dtos/task.dto';
import { UpdateTaskDTO } from './dtos/update-task.dto';
import { TaskService } from './task.service';

@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('search/offset')
  @ApiOperation({
    summary: '스케쥴 작업 오프셋 기반 조회',
    description: '스케쥴 작업을 오프셋 기반으로 조회합니다.',
  })
  @ApiOkResponse({
    type: OffsetPaginationDTO<TaskDTO>,
    description: '스케쥴 작업 목록',
  })
  @ApiOffsetPagination(TaskDTO)
  async searchOffset(
    @Query() option: TaskSearchOffsetOptionDTO,
  ): Promise<OffsetPaginationDTO<TaskDTO>> {
    const { items, pageInfo } = await this.taskService.searchOffset(option);

    return {
      items: plainToInstance(TaskDTO, items),
      pageInfo,
    };
  }

  @Get('search/cursor')
  @ApiOperation({
    summary: '스케쥴 작업 커서 기반 조회',
    description: '스케쥴 작업을 커서 기반으로 조회합니다.',
  })
  @ApiOkResponse({
    type: CursorPaginationDTO<TaskDTO>,
    description: '스케쥴 작업 목록',
  })
  @ApiCursorPagination(TaskDTO)
  async searchCursor(
    @Query() option: TaskCursorSearchOptionDTO,
  ): Promise<CursorPaginationDTO<TaskDTO>> {
    const { items, ...cursorInfo } =
      await this.taskService.searchCursor(option);

    return {
      items: plainToInstance(TaskDTO, items),
      ...cursorInfo,
    };
  }

  @Patch(':id/stop')
  @ApiOperation({
    summary: '스케쥴 작업 중지',
    description: '스케쥴 작업을 중지합니다.',
  })
  @ApiOkResponse({
    type: Boolean,
    description: '스케쥴 작업 중지 여부',
  })
  async stop(@Param('id') id: string): Promise<boolean> {
    const task = await this.taskService.stop(id);

    return task.status === TaskStatus.STOPPED;
  }

  @Patch(':id/restart')
  @ApiOperation({
    summary: '스케쥴 작업 재시작',
    description: '스케쥴 작업을 재시작합니다.',
  })
  @ApiOkResponse({
    type: Boolean,
    description: '스케쥴 작업 재시작 여부',
  })
  async restart(@Param('id') id: string): Promise<boolean> {
    const task = await this.taskService.restart(id);

    return task.status === TaskStatus.RUNNING;
  }

  @Patch(':id')
  @ApiOperation({
    summary: '스케쥴 작업 수정',
    description: '스케쥴 작업을 수정합니다.',
  })
  @ApiOkResponse({
    type: TaskDTO,
    description: '수정된 스케쥴 작업',
  })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateTaskDTO,
  ): Promise<TaskDTO> {
    const task = await this.taskService.update(id, data);

    return plainToInstance(TaskDTO, task);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '스케쥴 작업 삭제',
    description: '스케쥴 작업을 삭제합니다.',
  })
  @ApiOkResponse({
    type: TaskDTO,
    description: '삭제된 스케쥴 작업',
  })
  async delete(@Param('id') id: string): Promise<TaskDTO> {
    const task = await this.taskService.delete(id);

    return plainToInstance(TaskDTO, task);
  }

  @Delete()
  @ApiOperation({
    summary: '스케쥴 작업 다중 삭제',
    description: '여러 스케쥴 작업을 삭제합니다.',
  })
  @ApiOkResponse({
    description: '삭제된 스케쥴 작업 수',
  })
  async deleteMany(
    @Body() ids: DeleteManyTaskDTO,
  ): Promise<Prisma.BatchPayload> {
    return this.taskService.deleteMany(ids);
  }
}
