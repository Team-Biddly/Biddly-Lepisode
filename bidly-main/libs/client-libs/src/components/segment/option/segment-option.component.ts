import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Type,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { OptionDirective } from '../../../directives/option.directive';
import { Badge } from '../../badge/badge.component';
import { BaseConfig } from '../../common/config/config.adapter';
import { SegmentOption } from '../segment.component';
import { Icon } from '../../icon/icon.component';
import { Color } from '../../common/types';

@Component({
  selector: '[segmentOption]',
  templateUrl: './segment-option.component.html',
  styleUrls: ['../segment.component.css'],
  imports: [CommonModule, Icon, Badge],
})
export class SegmentOptionComponent
  extends BaseConfig
  implements AfterViewInit
{
  @HostBinding('class') hostClass = 'w-full';

  readonly changeRef = inject(ChangeDetectorRef);
  readonly elementRef = inject(ElementRef);

  option = input.required<SegmentOption>();
  active = input<boolean>(false);
  color = input<Color>('primary');
  directiveRef = viewChild(OptionDirective);

  ngAfterViewInit(): void {
    const renderItem = this.option()?.renderItem;
    if (renderItem) {
      const viewContainerRef = this.directiveRef()?.viewContainerRef;
      viewContainerRef?.clear();
      const componentRef = viewContainerRef?.createComponent(
        renderItem as Type<unknown>,
      );
      componentRef?.setInput('option', this.option());

      this.changeRef.detectChanges();
    }
  }
}
