/* eslint-disable @typescript-eslint/no-empty-function */
import {
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  input,
  model,
  OnInit,
  signal,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
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
} from "@angular/forms";
import { BaseConfig } from "../common/config/config.adapter";
import { Color, Rounded, Size } from "../common/types";
import { map } from "rxjs";

@Component({
  standalone: true,
  template: "",
})
export class BaseInput<T>
  extends BaseConfig
  implements ControlValueAccessor, OnInit
{
  readonly injector = inject(Injector);
  readonly elementRef = inject(ElementRef<HTMLElement>);
  formControl: FormControl | null = null;

  type = input<string>("text");
  color = input<Color>();
  size = input<Size>();
  rounded = input<Rounded>();

  config = computed(() => this.globalConfig()?.input);
  currentSize = computed(() => this.size() || this.config()?.size || "md");
  currentColor = computed(
    () => this.color() || this.config()?.color || "primary"
  );
  currentRounded = computed(
    () => this.rounded() || this.config()?.rounded || "md"
  );

  value = model<T>();
  value$ = toObservable(this.value);

  label = input<string | undefined>(undefined);
  placeholder = input<string>("");

  _readonly = input<boolean, string | boolean>(false, {
    alias: "readonly",
    transform: booleanAttribute,
  });
  $readonly = signal<boolean>(false);
  readonly = computed(() => this._readonly() || this.$readonly());

  _disabled = input<boolean, string | boolean>(false, {
    alias: "disabled",
    transform: booleanAttribute,
  });
  $disabled = signal<boolean>(false);
  disabled = computed(() => this._disabled() || this.$disabled());

  _required = input<boolean, string | boolean>(false, {
    alias: "required",
    transform: booleanAttribute,
  });
  $required = signal<boolean>(false);
  required = computed(() => this._required() || this.$required());

  autofocus = input<boolean, string | boolean>(false, {
    transform: booleanAttribute,
  });
  debounce = input<number>(0);
  autocomplete = input<string>();
  spellcheck = input<boolean, string | boolean>(false, {
    transform: booleanAttribute,
  });

  maxlength = input<number>();

  constructor() {
    super();

    this.value$.subscribe({
      next: (value) => {
        this.onChange(value!);
        this.writeValue(value);
      },
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
      this.$required.set(true);
      this.elementRef.nativeElement.setAttribute("data-required", "true");
    }

    if (this._required()) {
      this.$required.set(true);
      this.elementRef.nativeElement.setAttribute("data-required", "true");
    }
  }

  onChange = (value: T) => {};
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
  setDisabledState?(isDisabled: boolean): void {
    this.$disabled.set(isDisabled);
  }
}
