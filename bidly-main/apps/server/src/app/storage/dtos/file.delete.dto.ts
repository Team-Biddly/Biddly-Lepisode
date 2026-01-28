import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class FileDeleteDTO {
    @ApiProperty({
        description: '파일 URL 목록',
        example: [
            'https://kr1-api-object-storage.nhncloudservice.com/v1/AUTH_a07d5e8cf26f41d3804516d8f66a5160/test/1729127798_istockphoto-1160023776-612x612.jpg',
        ],
        required: true,
        isArray: true,
        type: 'string',
    })
    @IsNotEmpty({
        message: '파일 URL 목록은 필수값입니다.',
    })
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    urls: string[];

    constructor() {
        this.urls = [];
    }
}
