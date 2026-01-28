import { Directive, inject, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[option]',
  standalone: true,
})
export class OptionDirective {
  readonly viewContainerRef = inject(ViewContainerRef);
}
