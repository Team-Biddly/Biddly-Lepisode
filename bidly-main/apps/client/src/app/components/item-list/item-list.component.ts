import { AfterViewInit, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Icon } from '@client-libs';
import { Item } from '../../../../mocks/items';

@Component({
  selector: 'app-item-list',
  imports: [CommonModule, Icon],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css',
})
export class ItemListComponent implements AfterViewInit {
  item = input<Item>();

  ngAfterViewInit() {
    console.log('ItemListComponent ngAfterViewInit: ', this.item());
  }
}
