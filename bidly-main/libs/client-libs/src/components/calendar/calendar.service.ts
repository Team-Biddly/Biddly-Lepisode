import { inject, Injectable } from '@angular/core';
import dayjs from 'dayjs';
import { ModalService } from '../../services/modal/modal.service';
import { CalendarStore } from './calendar.store';
import { CalendarEvent, CalendarEventMenu } from './calendar.types';
import { CreateEventModal } from './etc/modals/create-event/create-event.modal';

@Injectable({ providedIn: 'any' })
export class CalendarService {
  readonly modalService = inject(ModalService);
  readonly store = inject(CalendarStore);

  handleEventMenu(ev: CalendarEventMenu, event: CalendarEvent) {
    switch (ev) {
      case 'edit':
        this.handleEdit(event);
        break;
      case 'delete':
        this.handleDelete(event);
        break;
      case 'copy':
        this.handleCopy(event);
    }

    this.store.setValue(dayjs(event.startDate).toDate());
  }

  handleCreate(date?: Date) {
    if (this.store.options()?.form === 'custom') {
      this.store.customCreateEvent(date);
      return;
    }

    const dialog = this.modalService.create(CreateEventModal, {
      componentProps: {
        date,
      },
    });

    dialog.closed.subscribe((res: any) => {
      const event = res.data as CalendarEvent;
      if (event) {
        this.store.createEvent(event);
      }
    });
  }

  handleEdit(event: CalendarEvent) {
    if (this.store.options()?.form === 'custom') {
      this.store.customUpdateEvent(event);
      return;
    }

    const dialog = this.modalService.create(CreateEventModal, {
      componentProps: {
        event,
      },
    });

    dialog.closed.subscribe((res: any) => {
      const update = res?.data as CalendarEvent;
      if (update) {
        this.store.createEvent(update);
      }
    });
  }

  handleDelete(event: CalendarEvent) {
    const events = this.store.events() || [];

    const find = events.find((e) => e.id === event.id);
    this.store.deleteEvent(find!);
  }

  handleCopy(event: CalendarEvent) {
    this.store.copyEvent(event);
  }
}
