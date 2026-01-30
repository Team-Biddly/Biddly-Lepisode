import {
  AfterViewInit,
  Directive,
  effect,
  ElementRef,
  Injector,
  input,
  model,
  OnInit,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroup,
  NgControl,
  NgModel,
  Validators,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, fromEvent } from 'rxjs';
import { controlValueAccessorProvider } from '../common/value-accessor';

@Directive({
  selector: '[appInput]',
  providers: [controlValueAccessorProvider(InputDirective)],
})
export class InputDirective
  implements AfterViewInit, OnInit, ControlValueAccessor
{
  debounce = input<number>(0);
  value = model<any>();
  value$ = toObservable(this.value);

  formControl: FormControl | null = null;

  constructor(
    private readonly elementRef: ElementRef<HTMLInputElement>,
    private readonly injector: Injector,
  ) {
    effect(() => {
      this.onChange(this.value()!);
    });
  }

  ngOnInit(): void {
    const ngControl = this.injector.get(NgControl, null, {
      self: true,
      optional: true,
    });

    if (ngControl instanceof NgModel) {
      this.formControl = ngControl.control as FormControl;
    } else if (ngControl instanceof FormControlDirective) {
      this.formControl = ngControl.control;
    } else if (ngControl instanceof FormControlName) {
      const container = this.injector.get(ControlContainer, null)
        ?.control as FormGroup;
      this.formControl = container.controls[ngControl.name!] as FormControl;
    }

    if (this.formControl?.hasValidator(Validators.required)) {
      this.elementRef.nativeElement.setAttribute('data-required', 'true');
    }
  }

  async ngAfterViewInit() {
    this.value$.subscribe((value) => {
      if (value) {
        this.elementRef!.nativeElement.value = value.toString() || '';
      }
    });

    // type이 date일 때 작동하지 않음
    fromEvent(this.elementRef!.nativeElement, 'input')
      .pipe(debounceTime(this.debounce()), distinctUntilChanged())
      .subscribe((ev: Event) => {
        const inputElement = ev.target as HTMLInputElement;
        let inputValue = inputElement?.value;
        this.value.set(inputValue);
      });
  }

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(obj: any): void {
    this.value.set(obj);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {}
}
