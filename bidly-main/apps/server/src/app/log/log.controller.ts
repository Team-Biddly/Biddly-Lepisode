import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { LogService } from './log.service';
import { ApiOffsetPagination, OffsetPaginationDTO } from '../../libs';
import { LogDTO } from './dtos/log.dto';
import { LogSearchOptionDTO } from './dtos/log-search-option.dto';
import { UserRole } from '@common';

@Auth(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@ApiTags('Log')
@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get('search/offset')
  @Auth(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: '관리자 로그 오프셋 기반 조회',
  })
  @ApiOkResponse({
    type: OffsetPaginationDTO<LogDTO>,
    description: '관리자 로그 목록',
  })
  @ApiOffsetPagination(LogDTO)
  async searchOffset(
    @Query() option: LogSearchOptionDTO,
  ): Promise<OffsetPaginationDTO<LogDTO>> {
    return await this.logService.searchOffset(option);
  }
}
