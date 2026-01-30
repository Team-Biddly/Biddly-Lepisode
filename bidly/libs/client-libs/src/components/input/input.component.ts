/* eslint-disable @angular-eslint/component-class-suffix */
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  input,
  OnInit,
  output,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, distinctUntilChanged, fromEvent, skip } from 'rxjs';
import { Icon } from '../icon/icon.component';
import { BaseInput } from './base-input';
import { Color, Rounded, Size } from '../common/types';
import { Label } from '../label/label.component';

@Component({
  selector: 'app-input',
  host: {
    ngSkipHydration: 'true',
  },
  standalone: true,
  imports: [Icon, Label, CommonModule],
  styleUrl: './input.component.scss',
  templateUrl: './input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: Input,
      multi: true,
    },
  ],
})
export class Input
  extends BaseInput<any>
  implements AfterViewInit, OnInit, ControlValueAccessor
{
  inputClick = output<void>();
  inputFocus = output<void>();
  inputBlur = output<void>();
  inputKeydown = output<KeyboardEvent>();

  inputRef = viewChild<ElementRef<HTMLInputElement>>('inputRef');

  suffix = input<string>();
  prefixIcon = input<string>();
  suffixIcon = input<string>();
  icon = input<string>();

  async ngAfterViewInit() {
    this.value$.subscribe((value) => {
      if (value) {
        this.inputRef()!.nativeElement.value = value.toString()!;
      }
    });

    // type이 date일 때 작동하지 않음
    fromEvent(this.inputRef()!.nativeElement, 'input')
      .pipe(skip(1), debounceTime(this.debounce()), distinctUntilChanged())
      .subscribe((ev: any) => {
        this.value.set(ev.target.value);
      });
  }

  /**
   * @description input element의 change 이벤트 발생 시 호출되는 함수
   * (type이 date인 경우에만 호출)
   */
  handleChange() {
    if (this.type() === 'date') {
      this.value.set(this.inputRef()!.nativeElement.value);
    }
  }

  handlePaste(event: ClipboardEvent) {
    const pastedText = event.clipboardData?.getData('text') || '';

    if (pastedText) {
      this.value.set(pastedText);
    }
  }
}
