import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  booleanAttribute,
  Component,
  ContentChildren,
  input,
  OnChanges,
  QueryList,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { SideMenuItemChild } from '../side-menu-item/side-menu-item-child/side-menu-item-child.component';
import { Icon } from '@client-libs';

@Component({
  selector: 'app-side-menu-item-group',
  standalone: true,
  imports: [CommonModule, RouterModule, Icon],
  templateUrl: './side-menu-item-group.component.html',
  styleUrls: ['./side-menu-item-group.component.css'],
})
export class SideMenuItemGroup implements AfterContentInit, OnChanges {
  @ContentChildren(SideMenuItemChild) children:
    | QueryList<SideMenuItemChild>
    | undefined;

  isOpen = signal<boolean>(false);

  icon = input.required<string>();
  label = input.required<string>();
  active = input<boolean>(false);

  ngOnChanges() {
    this.isOpen.set(this.active());
  }

  ngAfterContentInit() {
    setTimeout(() => {
      if (this.children && this.children.length > 0) {
        this.children.map((child) => {
          if (child.active()) {
            this.isOpen.set(true);
          }
        });
      }
    }, 50);
  }
}
