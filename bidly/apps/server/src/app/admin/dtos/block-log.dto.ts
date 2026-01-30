import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserDTO } from '../../user/dtos/user.dto';

@Exclude()
export class BlockLogDTO {
    @ApiProperty({
        description: '차단 로그 ID',
    })
    @Expose()
    id: string;

    @ApiProperty({
        description: '차단 진행 일자',
    })
    @Expose()
    @Type(() => Date)
    createdAt: Date;

    @ApiProperty({
        description: '차단 완료 일자',
    })
    @Expose()
    @Type(() => Date)
    until?: Date;

    @ApiProperty({
        description: '사용자 ID',
    })
    @Expose()
    userId: string;

    @ApiProperty({
        description: '차단한 사용자',
        type: () => UserDTO,
    })
    @Expose()
    @Type(() => UserDTO)
    user: UserDTO;

    @ApiProperty({
        description: '대상 사용자 ID',
    })
    @Expose()
    blockedUserId: string;

    @ApiProperty({
        description: '차단된 사용자',
        type: () => UserDTO,
    })
    @Expose()
    @Type(() => UserDTO)
    blockedUser: UserDTO;

    constructor() {
        this.id = '';
        this.createdAt = new Date();
        this.until = undefined;
        this.userId = '';
        this.user = new UserDTO();
        this.blockedUserId = '';
        this.blockedUser = new UserDTO();
    }
}
