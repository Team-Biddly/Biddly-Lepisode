import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserSchedulerService } from './user.scheduler.service';
import { UserService } from './user.service';
import { UserRoleModule } from './role/user-role.module';

@Module({
  imports: [UserRoleModule],
  controllers: [UserController],
  providers: [UserService, UserSchedulerService],
  exports: [UserService, UserSchedulerService],
})
export class UserModule {}
