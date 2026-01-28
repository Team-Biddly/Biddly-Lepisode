import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import dayjs from 'dayjs';
import { map } from 'rxjs';
import { CalendarEvent } from '../../../calendar.types';
import { Checkbox } from '../../../../checkbox/checkbox.component';
import { BaseConfig } from '../../../../common/config/config.adapter';
import { ModalService } from '../../../../../services/modal/modal.service';
import { Color } from '@common';
import { InputDirective } from '../../../../input/input.directive';
import { ColorPickerComponent } from '../../../../color-picker/color-picker.component';

@Component({
  selector: 'app-create-event-modal',
  templateUrl: './create-event.modal.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Checkbox,
    CommonModule,
    InputDirective,
    ColorPickerComponent,
  ],
})
export class CreateEventModal extends BaseConfig implements OnInit {
  readonly modalService = inject(ModalService);

  date = input<Date>();
  event = input<CalendarEvent | null>(null);

  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    content: new FormControl(''),
    startDate: new FormControl<Date | null>(null, [Validators.required]),
    endDate: new FormControl<Date | null>(null),
    startTime: new FormControl(''),
    endTime: new FormControl(''),
    allDay: new FormControl(false),
    color: new FormControl<Color | string>('primary'),
    hasTime: new FormControl(false),
    hasEndDate: new FormControl(false),
    repeat: new FormControl<boolean>(false),
  });

  values = toSignal(this.form.valueChanges.pipe(map((value) => value)));
  hasTime = computed(() => this.values()?.hasTime);
  hasEndDate = computed(() => this.values()?.hasEndDate);
  allDay = computed(() => this.values()?.allDay);
  color = computed(() => this.values()?.color);

  ngOnInit(): void {
    if (this.date()) {
      this.form.patchValue({
        startDate: this.date(),
        endDate: this.date(),
      });
    }

    if (this.event()) {
      this.form.patchValue({
        ...this.event(),
        hasEndDate:
          dayjs(this.event()?.startDate).format('YYYY-MM-DD') !==
          dayjs(this.event()?.endDate).format('YYYY-MM-DD'),
      });

      if (!this.event()?.allDay) {
        this.form.patchValue({
          startTime: dayjs(this.event()?.startDate).format('HH:mm'),
          endTime: dayjs(this.event()?.endDate).format('HH:mm'),
          hasEndDate: true,
        });
      }
    }

    this.form.valueChanges.subscribe({
      next: (value) => {
        if (value.hasEndDate) {
          const endDate = dayjs(value.endDate);
          const startDate = dayjs(value.startDate);

          if (endDate.isBefore(startDate)) {
            const temp = endDate;
            this.form.controls.endDate.setValue(startDate.toDate());
            this.form.controls.startDate.setValue(temp.toDate());
          }
        }
      },
    });
  }

  submit() {
    if (!this.form.valid) return;

    if (this.hasTime()) {
      const startDate = dayjs(this.form.value.startDate).format('YYYY-MM-DD');
      const value = dayjs(`${startDate} ${this.form.value.startTime}`).toDate();
      this.form.controls.startDate.setValue(value);

      if (this.hasEndDate()) {
        const endDate = dayjs(this.form.value.endDate).format('YYYY-MM-DD');
        const value = dayjs(`${endDate} ${this.form.value.endTime}`).toDate();
        this.form.controls.endDate.setValue(value);
      }
    }

    if (!this.hasEndDate()) {
      this.form.patchValue({
        endDate: this.form.value.startDate,
      });
    }

    const payload = this.form.getRawValue();
    this.modalService.close({
      endDate: payload.endDate!,
      startDate: payload.startDate!,
      title: payload.title || '',
      allDay: payload.allDay || false,
      color: payload.color || 'primary',
      content: payload.content || '',
      hasTime: payload.hasTime || false,
      repeat: payload.repeat!,
    });
  }
}
