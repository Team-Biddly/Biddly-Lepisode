import { CommonModule } from '@angular/common';
import {
  Component,
  contentChild,
  ElementRef,
  input,
  signal,
} from '@angular/core';
import { BaseConfig } from '../common/config/config.adapter';
import { Icon } from '../icon/icon.component';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule, Icon],
  templateUrl: './accordion.component.html',
})
export class Accordion extends BaseConfig {
  headerContent = contentChild<ElementRef<HTMLElement>>('headerContent');

  title = input<string>('');
  default = input<'open' | 'close'>('open');
  open = signal(false);

  ngOnInit() {
    this.open.set(this.default() === 'open');
  }

  toggle() {
    this.open.set(!this.open());
  }

  slotClick(ev: any) {
    ev.stopPropagation();
  }
}
