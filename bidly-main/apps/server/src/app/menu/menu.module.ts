import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './services/menu.service';
import { MenuPermissionService } from './services/menu-permission.service';

@Module({
  providers: [MenuService, MenuPermissionService],
  controllers: [MenuController],
})
export class MenuModule {}
