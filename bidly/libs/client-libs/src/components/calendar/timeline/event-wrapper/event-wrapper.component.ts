import { CommonModule } from "@angular/common";
import { Component, computed, input, output } from "@angular/core";
import dayjs, { Dayjs } from "dayjs";
import {
  CalendarEvent,
  CalendarEventMenu,
  TimelineSlot,
} from "../../calendar.types";
import { TimelineEvent } from "../event/event.component";

@Component({
  selector: "app-timeline-event-wrapper",
  templateUrl: "./event-wrapper.component.html",
  standalone: true,
  imports: [TimelineEvent, CommonModule],
})
export class TimelineEventWrapper {
  menu = output<[CalendarEventMenu, CalendarEvent]>();

  events = input.required<CalendarEvent[]>();
  day = input.required<Dayjs>();
  time = input.required<string>();
  slots = input.required<TimelineSlot[]>();

  /**
   * 같은 날짜의 이벤트만 필터링합니다.
   */
  renderEvents = computed(() => {
    return this.events()?.filter(
      (event) =>
        dayjs(event.startDate).format("YYYY-MM-DD") ===
        this.day().format("YYYY-MM-DD"),
    );
  });
}
