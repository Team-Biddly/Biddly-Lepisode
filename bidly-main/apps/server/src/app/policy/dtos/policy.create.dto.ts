import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class PolicyCreateDTO {
    @ApiPropertyOptional({
        description: '제목',
    })
    @IsOptional()
    title?: string;

    @ApiPropertyOptional({
        description: '내용',
    })
    @IsOptional()
    content?: string;

    @ApiPropertyOptional({
        description: '활성화 여부',
    })
    @IsOptional()
    @Type(() => Boolean)
    isActive?: boolean;
}
