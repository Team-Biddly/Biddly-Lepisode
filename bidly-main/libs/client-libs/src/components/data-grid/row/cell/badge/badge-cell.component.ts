import { Component, computed, effect } from '@angular/core';
import { get } from '../../../../../helpers/object-get';
import {
  BooleanColumnDefinition,
  EnumColumnDefinition,
} from '../../../types/colum-definition.type';
import { CellAdapter } from '../cell.adapter';
import { CommonModule } from '@angular/common';
import { Badge } from '../../../../badge/badge.component';

@Component({
  selector: 'app-badge-cell',
  template: `
    <app-badge [variant]="variant()!" [color]="props()?.color!">{{
      props()?.text
    }}</app-badge>
  `,
  imports: [CommonModule, Badge],
})
export class BadgeCell extends CellAdapter {
  gridOptions = this.store.tableOptions;
  variant = computed(() => this.gridOptions()?.badge?.variant);

  props = computed(() => {
    if (!this.column()) return;

    if (this.column().type === 'boolean') {
      return this.handleBooleanColumn();
    } else {
      return this.handleEnumColumn();
    }
  });

  handleBooleanColumn() {
    const column = this.column() as BooleanColumnDefinition;
    const value = get(this.row(), this.column().field, '');
    return column.badgeProps![value === true ? 'true' : 'false']!;
  }

  handleEnumColumn() {
    const column = this.column() as EnumColumnDefinition;
    const value = get(this.row(), this.column().field, '');
    return column.badgeProps![value];
  }
}
