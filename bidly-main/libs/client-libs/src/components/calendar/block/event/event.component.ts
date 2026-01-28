import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { DndDraggableDirective } from 'ngx-drag-drop';
import { Menu } from '../../../menu/menu.component';
import { MenuOption } from '../../../menu/option/menu-option.component';
import { BlockCalendarEventContent } from './content/event-content.component';
import { CalendarEventAdapter } from './event.adapter';

/**
 * @export CalendarEventItem
 * @description 이벤트의 전체적인 스타일링이 필요하다면 해당 컴포넌트의 css 참조
 */

@Component({
  selector: 'app-block-calendar-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    CdkMenuModule,
    DndDraggableDirective,
    Menu,
    MenuOption,
    BlockCalendarEventContent,
  ],
})
export class BlockCalendarEvent extends CalendarEventAdapter {}
