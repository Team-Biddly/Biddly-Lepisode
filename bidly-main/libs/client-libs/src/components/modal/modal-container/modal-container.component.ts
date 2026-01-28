import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, viewChild } from '@angular/core';

@Component({
  selector: 'app-modal-container',
  template: `
    <section
      #modal
      class="w-screen h-dvh lg:rounded-[20px] lg:w-auto lg:h-auto bg-white"
    >
      <section #header class="rounded-t-[20px] overflow-hidden">
        <ng-content select="[header]" />
      </section>
      <section
        #content
        class="h-full sm:min-w-[30rem] sm:max-h-[60rem] sm:h-auto overflow-y-auto no-scrollbar"
      >
        <ng-content />
      </section>
    </section>
  `,
  imports: [CommonModule],
})
export class ModalContainer implements AfterViewInit {
  modalRef = viewChild<ElementRef<HTMLElement>>('modal');
  contentRef = viewChild<ElementRef<HTMLElement>>('content');
  headerRef = viewChild<ElementRef<HTMLElement>>('header');
  footerRef = viewChild<ElementRef<HTMLElement>>('footer');

  ngAfterViewInit() {
    this.modalRef()?.nativeElement.animate(
      [
        { opacity: 0, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      {
        duration: 200,
        easing: 'ease-in-out',
      },
    );

    // set padding-top to contentRef based on modalRef height

    const content = this.contentRef()?.nativeElement;
    const header = this.headerRef()?.nativeElement;
    const footer = this.footerRef()?.nativeElement;

    if (content) {
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        content.style.paddingBottom = '0px';
        return;
      }

      const headerHeight = header?.offsetHeight || 0;
      const footerHeight = footer?.offsetHeight || 0;
      content.style.paddingBottom = `${headerHeight + footerHeight}px`;
    }
  }
}
