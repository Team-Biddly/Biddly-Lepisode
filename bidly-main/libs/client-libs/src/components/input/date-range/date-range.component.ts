import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import { DatePicker } from '../date-picker/date-picker.component';
import { Fieldset } from '../../fieldset/fieldset.component';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  imports: [CommonModule, FormsModule, DatePicker, Fieldset],
})
export class DateRange {
  label = input<string>('');
  required = input<boolean, string>(false, { transform: booleanAttribute });

  startAt = model<Date>();
  endAt = model<Date>();

  handleChange() {
    if (this.startAt() && this.endAt()) {
      const startAt = dayjs(this.startAt());
      const endAt = dayjs(this.endAt());

      if (startAt.isAfter(endAt)) {
        const temp = this.startAt();
        this.startAt.set(this.endAt());
        this.endAt.set(temp);
      }
    }
  }
}
