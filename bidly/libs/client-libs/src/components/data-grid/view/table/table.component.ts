import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GridColumn } from '../../column/column.component';
import { GridRow } from '../../row/row.component';
import { GridViewAdapter } from '../view.adapter';
import { FADE_IN } from '../../../../animations/fade.animation';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-grid-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  standalone: true,
  imports: [GridRow, GridColumn, CommonModule, CdkDropList, CdkDrag],
  animations: [FADE_IN],
})
export class GridTable extends GridViewAdapter {}
