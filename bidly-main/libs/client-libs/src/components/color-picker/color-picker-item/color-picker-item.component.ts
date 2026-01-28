import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, input, output } from '@angular/core';
import { Icon } from '../../icon/icon.component';

@Component({
  selector: 'app-color-picker-item',
  templateUrl: './color-picker-item.component.html',
  imports: [CommonModule, Icon],
})
export class ColorPickerItemComponent {
  setColor = output<string>();
  remove = output<void>();
  color = input<string>('');
  removeMode = input<boolean, string>(false, { transform: booleanAttribute });

  handleRemove(ev: any) {
    ev.stopPropagation();
    ev.preventDefault();

    this.remove.emit();
  }
}
