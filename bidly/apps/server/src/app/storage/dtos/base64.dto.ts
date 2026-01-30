import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class Base64DTO {
    @ApiProperty({
        description: 'base64',
    })
    @IsNotEmpty({
        message: 'base64를 입력해 해주세요.',
    })
    base64: string;

    @ApiProperty({
        description: '파일명',
    })
    @IsNotEmpty({
        message: '파일명을 입력해 주세요.',
    })
    filename: string;

    @ApiProperty({
        description: 'MIME 타입',
    })
    @IsNotEmpty({
        message: 'MIME 타입을 입력해 주세요.',
    })
    mimetype: string;

    constructor() {
        this.base64 = '';
        this.filename = '';
        this.mimetype = '';
    }
}
