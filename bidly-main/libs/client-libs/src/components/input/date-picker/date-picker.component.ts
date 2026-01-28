import { OverlayModule } from '@angular/cdk/overlay';
import {
  AfterViewInit,
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  input,
  model,
  ModelSignal,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ClickOutside } from 'ngxtension/click-outside';
import { toObservableSignal } from 'ngxtension/to-observable-signal';
import {
  ControlValueAccessorAdpater,
  controlValueAccessorProvider,
} from '../../common/value-accessor';
import { Fieldset } from '../../fieldset/fieldset.component';
import { Icon } from '../../icon/icon.component';
import { PickCalendar } from './pick-calendar/pick-calendar.component';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  imports: [
    Fieldset,
    Icon,
    FormsModule,
    PickCalendar,
    OverlayModule,
    ClickOutside,
  ],
  providers: [controlValueAccessorProvider(DatePicker)],
})
export class DatePicker
  extends ControlValueAccessorAdpater<Date>
  implements AfterViewInit
{
  open = signal(false);

  yearRef = viewChild<ElementRef<HTMLInputElement>>('yearRef');
  monthRef = viewChild<ElementRef<HTMLInputElement>>('monthRef');
  dayRef = viewChild<ElementRef<HTMLInputElement>>('dayRef');

  label = input<string>('');
  required = input<boolean, string>(false, { transform: booleanAttribute });

  year = model<string>('');
  year$ = toObservable(this.year);

  month = model<string>('');
  month$ = toObservable(this.month);

  day = model<string>('');
  day$ = toObservable(this.day);

  date = toObservableSignal(
    computed(() => {
      if (this.year() && this.month() && this.day()) {
        return new Date(
          Number(this.year()),
          Number(this.month()) - 1,
          Number(this.day()),
        );
      }

      return null;
    }),
  );

  readonly keyList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  readonly controlKeys = [
    'Backspace',
    'ArrowLeft',
    'ArrowRight',
    'Tab',
    'Delete',
  ];

  constructor() {
    super();

    this.date.subscribe({
      next: (date) => {
        if (date) {
          this.writeValue(date);
          this.onChange(date);
        }
      },
    });
  }

  handleOpen(ev: Event) {
    this.open.set(true);
    ev.stopPropagation();
    ev.preventDefault();
  }

  ngAfterViewInit(): void {
    this.year$.subscribe({
      next: (year) => {
        if (year?.length === 4) {
          this.monthRef()?.nativeElement.focus();
        }
      },
    });

    this.month$.subscribe({
      next: (month) => {
        if (month?.length === 2) {
          this.dayRef()?.nativeElement.focus();
        }
      },
    });

    this.day$.subscribe({
      next: (day) => {
        if (day === '33') {
          this.day.set('03');
        } else if (day === '00') {
          this.day.set('01');
        } else if (Number(day) > 31) {
          this.day.set(day.slice(1));
        }
      },
    });
  }

  handleBackspace(event: KeyboardEvent, modelSignal: ModelSignal<string>) {
    if (event.key === 'Backspace') {
      modelSignal.set('');
      event.preventDefault();
    }
  }

  handlePaste(event: ClipboardEvent): void {
    const pasteData = event.clipboardData?.getData('text') || '';
    if (!/^\d+$/.test(pasteData)) {
      event.preventDefault();
    }
  }

  blockNonNumbers(event: KeyboardEvent): void {
    if (!/^\d$/.test(event.key) && !this.controlKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  yearKeydown(event: KeyboardEvent): void {
    if (this.keyList.includes(event.key) && this.year().length === 4) {
      this.year.set('');
    }

    this.blockNonNumbers(event);
    this.handleBackspace(event, this.year);

    if (this.keyList.includes(event.key) && this.year().length < 4) {
      this.year.set(this.year() + event.key);
      event.preventDefault();
    }
  }

  monthKeydown(event: KeyboardEvent): void {
    if (this.keyList.includes(event.key) && this.month().length === 2) {
      this.month.set('');
    }

    this.blockNonNumbers(event);
    this.handleBackspace(event, this.month);

    if (this.keyList.includes(event.key)) {
      const value = this.month();
      let nextValue = value + event.key;

      if (Number(nextValue) > 12) {
        nextValue = '0' + event.key;
      }

      this.month.set(nextValue.slice(0, 2));
      event.preventDefault();
    }
  }

  dayKeydown(event: KeyboardEvent): void {
    if (this.keyList.includes(event.key) && this.day().length === 2) {
      this.day.set('');
    }

    this.blockNonNumbers(event);
    this.handleBackspace(event, this.day);

    if (this.keyList.includes(event.key)) {
      const value = this.day();
      let nextValue = value + event.key;

      if (Number(nextValue) > 31) {
        nextValue = '0' + event.key;
      }

      this.day.set(nextValue.slice(0, 2));
      event.preventDefault();
    }
  }

  handleValueChange() {
    const year = this.value()?.getFullYear().toString();
    const month = (this.value()?.getMonth()! + 1).toString();
    const day = this.value()?.getDate().toString();

    this.year.set(year!);
    this.month.set(month.length < 2 ? '0' + month : month);
    this.day.set(day && day.length < 2 ? '0' + day : day || '');
  }

  reset() {
    this.year.set('');
    this.month.set('');
    this.day.set('');
    this.yearRef()?.nativeElement.focus();
  }
}
