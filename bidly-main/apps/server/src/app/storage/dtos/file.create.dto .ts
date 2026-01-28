import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class FileCreateDTO {
    @ApiProperty({
        description: '파일',
    })
    @IsNotEmpty({
        message: '파일을 업로드 해주세요.',
    })
    files: Express.Multer.File[];

    @ApiProperty({
        description: 'containerName',
    })
    @IsNotEmpty({
        message: 'containerName 입력해 주세요.',
    })
    containerName: string;

    @ApiProperty({
        description: 'modelName',
    })
    @IsNotEmpty({
        message: 'modelName 입력해 주세요.',
    })
    modelName: string;

    @ApiProperty({
        description: 'modelId',
    })
    @IsNotEmpty({
        message: 'modelId 입력해 주세요.',
    })
    modelId: string;

    @ApiPropertyOptional({
        description: 'title',
    })
    @IsOptional()
    title: string;

    @ApiPropertyOptional({
        description: 'content',
    })
    @IsOptional()
    content: string;

    constructor() {
        this.files = [];
        this.containerName = 'assets';
        this.modelName = '';
        this.modelId = '';
        this.title = '';
        this.content = '';
    }
}
