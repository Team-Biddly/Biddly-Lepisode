import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  viewChild,
} from '@angular/core';
import { OptionDirective } from '../../../../../directives/option.directive';
import { CustomColumnDefinition } from '../../../types/colum-definition.type';
import { CellAdapter } from '../cell.adapter';

@Component({
  selector: 'app-custom-cell',
  template: ` <ng-template option /> `,
  standalone: true,
  imports: [OptionDirective],
})
export class CustomCell extends CellAdapter implements AfterViewInit {
  changeRef = inject(ChangeDetectorRef);
  customCell = viewChild(OptionDirective);

  ngAfterViewInit(): void {
    const column = this.column() as CustomColumnDefinition;

    if (this.customCell() && column.type === 'custom' && column.renderItem) {
      const viewContainerRef = this.customCell()?.viewContainerRef;
      viewContainerRef?.clear();

      const componentRef = viewContainerRef?.createComponent<CellAdapter>(
        column.renderItem,
      );

      componentRef?.setInput('row', this.row());
      componentRef?.setInput('column', this.column());

      this.changeRef.detectChanges();
    }
  }
}
