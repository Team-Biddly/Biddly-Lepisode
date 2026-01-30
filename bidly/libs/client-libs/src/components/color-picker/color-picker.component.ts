import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { Component, inject, model, output } from '@angular/core';
import { ColorPickerDirective } from 'ngx-color-picker';
import { ColorPickerItemComponent } from './color-picker-item/color-picker-item.component';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  imports: [
    CdkMenuModule,
    CommonModule,
    ColorPickerDirective,
    ColorPickerItemComponent,
  ],
})
export class ColorPickerComponent {
  setColor = output<string>();

  cpColor = model<string>('');
  cpToggle = model<boolean>(false);

  /**
   * 기본 색상
   */
  colors: string[] = [
    '#D75E63',
    '#F43F5E',
    '#FB923C',
    '#FCD34D',
    '#84CC16',
    '#16A34A',
    '#1693C9',
    '#2563EB',
    '#7C3AED',
    '#C026D3',
  ];

  addColor() {}

  removeColor(color: string) {}
}
