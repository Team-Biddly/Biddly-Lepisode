import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ResetPasswordTokenDTO {
    @ApiProperty({
        description: 'token',
    })
    @IsNotEmpty({
        message: 'token을 입력해 주세요.',
    })
    email: string;

    @ApiProperty({
        description: 'random',
    })
    @IsNotEmpty({
        message: 'random을 입력해 주세요.',
    })
    random: string;

    constructor() {
        this.email = '';
        this.random = '';
    }
}
