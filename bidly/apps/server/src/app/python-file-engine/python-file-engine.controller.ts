import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileEngineService } from '../../../../../libs/api-client/src/file-engine/file-engine.service';
import { ApiConsumes, ApiBody, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Python File Engine Test')
@Controller('python-file-engine')
export class PythonFileEngineController {
  constructor(private readonly fileEngineService: FileEngineService) {}

  @Post('classify')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: '파일 분류 및 DB 저장 테스트 (FastAPI /test/classify)' })
  async classifyFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileEngineService.classifyFile(file);
  }

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: '파일 업로드 및 DB 저장 테스트 (FastAPI /test/upload)' })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileEngineService.uploadFile(file);
  }

  @Post('convert/hwp/:noticeId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'HWP 파일 변환 테스트 (FastAPI /test/hwp_convert/{notice_id})' })
  async convertHwp(@Param('noticeId') noticeId: string) {
    return this.fileEngineService.convertHwp(+noticeId);
  }

  @Post('convert/doc/:noticeId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'DOC 파일 변환 테스트 (FastAPI /test/doc_convert/{notice_id})' })
  async convertDoc(@Param('noticeId') noticeId: string) {
    return this.fileEngineService.convertDoc(+noticeId);
  }

  @Post('convert/pdf/:noticeId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'PDF 파일 변환 테스트 (FastAPI /test/pdf_convert/{notice_id})' })
  async convertPdf(@Param('noticeId') noticeId: string) {
    return this.fileEngineService.convertPdf(+noticeId);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '키워드 검색 테스트 (FastAPI /test/search)' })
  async searchKeyword(@Query('keyword') keyword: string) {
    return this.fileEngineService.searchKeyword(keyword);
  }
}
