import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { FileDeleteDTO } from './dtos/file.delete.dto';
import { FileDTO } from './dtos/file.dto';
import { FileSearchResponseDTO } from './dtos/file.search-response.dto';
import { FileSearchDTO } from './dtos/file.search.dto';
import { StorageService } from './storage.service';

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
    constructor(private readonly storageService: StorageService) {}

    @Get()
    @ApiOperation({
        summary: '파일 목록 조회',
    })
    @ApiResponse({
        description: '파일 목록',
        type: FileSearchResponseDTO,
    })
    async search(@Query() FileSearchDTO: FileSearchDTO): Promise<FileSearchResponseDTO> {
        return await this.storageService.search(FileSearchDTO);
    }

    @Get(':id')
    @ApiOperation({
        summary: '파일 상세 조회',
    })
    @ApiResponse({
        type: FileDTO,
    })
    async findById(@Param('id') id: string): Promise<FileDTO> {
        return await this.storageService.findById(id);
    }

    @Post()
    @ApiOperation({
        summary: '파일 업로드',
        description: '파일을 업로드합니다',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    })
    @ApiCreatedResponse({
        type: FileDTO,
        isArray: true,
        description: '업로드된 파일 정보',
    })
    @UseInterceptors(FilesInterceptor('file'))
    async uploadFiles(
        @UploadedFiles() file: Express.Multer.File,
        @Query('bucket') bucket?: string
    ) {
        return await this.storageService.upload(file, bucket);
    }

    @Delete()
    @ApiOperation({
        summary: '여러 파일 삭제',
        description: '여러 파일을 삭제합니다.',
    })
    @ApiOkResponse({
        schema: {
            type: 'object',
            properties: {
                count: { type: 'number' },
            },
        },
        description: '삭제된 파일 개수',
    })
    deleteMany(@Body() body: FileDeleteDTO) {
        return this.storageService.deleteMany(body);
    }
}
