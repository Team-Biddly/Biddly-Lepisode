import { NgModule } from '@angular/core';
import { SideMenu } from './side-menu.component';
import { SideMenuItemGroup } from './side-menu-item-group/side-menu-item-group.component';
import { SideMenuItemChild } from './side-menu-item/side-menu-item-child/side-menu-item-child.component';
import { SideMenuItem } from './side-menu-item/side-menu-item.component';

@NgModule({
  imports: [SideMenuItem, SideMenuItemChild, SideMenuItemGroup, SideMenu],
  exports: [SideMenuItem, SideMenuItemChild, SideMenuItemGroup, SideMenu],
})
export class SideMenuModule {}
