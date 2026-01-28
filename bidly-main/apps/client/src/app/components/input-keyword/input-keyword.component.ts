import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';
import { fromEvent, map } from 'rxjs';
import { NgAutoAnimateDirective } from 'ng-auto-animate';
import { Icon } from '@client-libs';
@Component({
  selector: 'app-input-keyword',
  imports: [CommonModule, NgAutoAnimateDirective, Icon],
  hostDirectives: [NgxControlValueAccessor],
  templateUrl: './input-keyword.component.html',
  styleUrl: './input-keyword.component.css',
})
export class InputKeywordComponent implements AfterViewInit {
  private readonly inputRef =
    viewChild.required<ElementRef<HTMLInputElement>>('inputRef');

  protected cva = inject<NgxControlValueAccessor<string[]>>(
    NgxControlValueAccessor,
  );

  ngAfterViewInit(): void {
    fromEvent(this.inputRef().nativeElement, 'keyup')
      .pipe(map((ev) => ev as KeyboardEvent))
      .subscribe((ev) => {
        if (ev.key === 'Enter') {
          const value = (ev.target as HTMLInputElement).value;

          const isDuplicate = this.cva.value.includes(value);

          if (isDuplicate) {
            (ev.target as HTMLInputElement).value = '';
            return;
          }

          this.cva.writeValue([...this.cva.value, value]);
          (ev.target as HTMLInputElement).value = '';
        }
      });
  }

  removeKeyword(keyword: string) {
    const filtered = this.cva.value.filter((k) => k !== keyword);
    this.cva.writeValue(filtered);
  }
}
