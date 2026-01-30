import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class FileConnectDTO {
    @ApiProperty({
        description: 'filename',
    })
    @IsNotEmpty({
        message: 'filename 입력해 주세요.',
    })
    filename: string;

    @ApiProperty({
        description: 'url',
    })
    @IsNotEmpty({
        message: 'modelName 입력해 주세요.',
    })
    url: string;

    @ApiProperty({
        description: 'size',
    })
    @IsNotEmpty({
        message: 'size 입력해 주세요.',
    })
    @Type(() => Number)
    size: number;

    constructor() {
        this.filename = '';
        this.url = '';
        this.size = 0;
    }
}
