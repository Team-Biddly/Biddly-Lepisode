import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerifyCodeDTO {
    @ApiProperty({
        description: 'token',
    })
    @IsNotEmpty({
        message: 'token을 입력해 주세요.',
    })
    token: string;

    @ApiProperty({
        description: '코드',
    })
    @IsNotEmpty({
        message: 'code를 입력해 주세요.',
    })
    code: string;

    constructor() {
        this.token = '';
        this.code = '';
    }
}
