import { Component, computed, HostBinding, input } from '@angular/core';
import { Color, Size } from '../common/types';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: ``,
  styleUrl: './icon.component.css',
  host: {
    '[attr.data-size]': 'size()',
    '[style]': 'style()',
    '[class]': 'class()',
  },
})
export class Icon {
  @HostBinding('class') get hostClass() {
    return this.$class();
  }

  name = input.required<string>();

  _name = computed(() =>
    encodeURI(`https://api.iconify.design/${this.name()}.svg`),
  );

  size = input<Size>('md');
  color = input<Color>('primary');
  $class = input<string>('', { alias: 'class' });

  style = computed(() => ({
    display: 'inline-block',
    maskSize: 'cover',
    maskImage: `url(${this._name()})`,
    webkitMaskSize: 'cover',
    webkitMaskImage: `url(${this._name()})`,
    background: 'currentColor',
  }));

  class = computed(
    () =>
      `${this.size() ? `${this.size()}` : ''}  ${
        this.color() ? this.color() : ''
      }`,
  );
}
