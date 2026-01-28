import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  model,
  OnInit,
  viewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MarkdownComponent, provideMarkdown } from 'ngx-markdown';
import { Color } from '../common/types';
import { Icon } from '../icon/icon.component';
import { AlertOptions, AlertResult } from './alert.type';
import { InputDirective } from '../input/input.directive';
import { Fieldset } from '../fieldset/fieldset.component';
import { Checkbox } from '../checkbox/checkbox.component';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
  imports: [
    Icon,
    FormsModule,
    ReactiveFormsModule,
    MarkdownComponent,
    CommonModule,
    InputDirective,
    Fieldset,
    Checkbox,
  ],
  providers: [provideMarkdown()],
})
export class AlertComponent implements OnInit, AfterViewInit {
  readonly dialogRef = inject<DialogRef<AlertResult>>(DialogRef<AlertResult>);
  readonly dialogData = inject<AlertOptions>(DIALOG_DATA);

  modalContainer = viewChild<ElementRef<HTMLElement>>('modalContainer');

  scrollIndicator =
    viewChild.required<ElementRef<HTMLDivElement>>('scrollIndicator');

  form: FormGroup | null = null;

  checked = model<boolean>(false);
  checkInvalid = computed(() =>
    this.dialogData.checkbox ? !this.checked() : false,
  );

  iconName = computed(() => {
    const _icon = this.dialogData.icon?.name;
    if (_icon) {
      return _icon;
    }

    switch (this.dialogData.type) {
      case 'success':
        return 'material-symbols:check-circle';
      case 'warning':
        return 'material-symbols:warning-rounded';
      case 'error':
        return 'solar:danger-circle-bold';
      case 'info':
        return 'material-symbols:info';
    }
  });

  iconColor = computed<Color>(() => {
    return this.dialogData.type;
  });

  iconClass = computed(() => {
    switch (this.dialogData.type) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      case 'info':
        return 'text-primary';
    }
  });

  ngAfterViewInit() {
    if (!this.modalContainer()) return;

    this.modalContainer()?.nativeElement.animate(
      [
        { opacity: 0, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      {
        duration: 200,
        easing: 'ease-in-out',
      },
    );
  }

  ngOnInit(): void {
    if (this.dialogData.inputs) {
      this.form = new FormGroup({});
      this.dialogData.inputs.forEach((input) => {
        const formControl = new FormControl(input.defaultValue, {
          validators:
            input.required || input.required !== false
              ? [Validators.required]
              : [],
        });
        this.form?.addControl(input.key, formControl);
      });
    }
  }

  onCancel() {
    this.dialogRef.close({
      action: 'cancel',
    });
  }

  onConfirm() {
    this.dialogRef.close({
      action: 'confirm',
      data: this.form?.getRawValue(),
    });
  }

  onScroll(event: any) {
    const target = event.target;
    if (!target) return;
    const clientHeight = target.clientHeight;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;

    const threshold = scrollHeight - clientHeight - 100;

    const hasScrollLeft = threshold > scrollTop;

    this.scrollIndicator().nativeElement.style.opacity = hasScrollLeft
      ? '1'
      : '0';
  }
}
