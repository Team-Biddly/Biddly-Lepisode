import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserDTO } from '../../user/dtos/user.dto';

@Exclude()
export class PolicyDTO {
    @ApiProperty({
        description: '정책 ID',
    })
    @Expose()
    id: string;

    @ApiProperty({
        description: '제목',
    })
    @Expose()
    title?: string;

    @ApiProperty({
        description: '내용',
    })
    @Expose()
    content?: string;

    @ApiProperty({
        description: '생성 일시',
        type: Date,
    })
    @Expose()
    @Type(() => Date)
    createdAt: Date;

    @ApiProperty({
        description: '수정 일시',
        type: Date,
    })
    @Expose()
    @Type(() => Date)
    updatedAt: Date;

    @ApiProperty({
        description: '활성화 여부',
        type: Boolean,
    })
    @Expose()
    isActive: boolean;

    @ApiProperty({
        description: '작성자 ID',
    })
    @Expose()
    adminId?: string;

    @ApiProperty({
        description: '작성자',
        type: () => UserDTO,
    })
    @Expose()
    @Type(() => UserDTO)
    admin?: UserDTO;

    constructor() {
        this.id = '';
        this.title = '';
        this.content = '';
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.isActive = false;
        this.adminId = '';
        this.admin = new UserDTO();
    }
}
