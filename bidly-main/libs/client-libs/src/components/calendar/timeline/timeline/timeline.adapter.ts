import { Component, inject, input } from "@angular/core";
import { BaseConfig } from "../../../common/config/config.adapter";
import { CalendarService } from "../../calendar.service";
import { CalendarStore } from "../../calendar.store";
import { CalendarEvent, CalendarEventMenu } from "../../calendar.types";

@Component({
  selector: "app-timeline-adapter",
  template: "",
  standalone: true,
})
export class TimelineAdapter extends BaseConfig {
  readonly service = inject(CalendarService);
  readonly store = inject(CalendarStore);

  events = this.store.events;

  /**
   * @description 이벤트 메뉴를 처리한다.
   * @param ev
   * @param event
   */
  handleEventMenu(ev: CalendarEventMenu, event: CalendarEvent) {
    this.service.handleEventMenu(ev, event);
  }
}
