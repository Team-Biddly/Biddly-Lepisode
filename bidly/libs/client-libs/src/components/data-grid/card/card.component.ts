import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { Menu } from '../../menu/menu.component';
import { MenuOption } from '../../menu/option/menu-option.component';
import { RowAdapter } from '../row/row.adapter';
import { Image } from '../../image/image.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, Image, Menu, MenuOption, CdkMenuModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class GridCard extends RowAdapter {
  galleryOptions = this.store.galleryOptions;

  title = computed(() => this.row()[this.galleryOptions()?.field.title] || '');
  content = computed(
    () => this.row()[this.galleryOptions()?.field.content] || '',
  );
  src = computed(
    () =>
      this.row()[this.galleryOptions()?.field?.image] ||
      'https://picsum.photos/200/300',
  );
}
