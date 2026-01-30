import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  input,
  Renderer2,
  signal,
} from '@angular/core';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@Directive({
  selector: '[appTooltip]',
})
export class TooltipDirective {
  text = input<string>('', { alias: 'appTooltip' });
  tooltipPosition = input<TooltipPosition>('bottom');

  private tooltipElement: HTMLElement | null = null;
  private margin = signal(5);

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  @HostBinding('style.position') position = 'relative';

  // 마우스를 요소 위에 올릴 때
  @HostListener('mouseenter') onMouseEnter() {
    if (!this.text()) {
      return;
    }

    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.appendChild(document.body, this.tooltipElement);
    this.renderer.addClass(this.tooltipElement, 'tooltip');
    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(
      this.tooltipElement,
      'background',
      'rgba(0, 0, 0, 0.75)',
    );
    this.renderer.setStyle(this.tooltipElement, 'color', '#fff');
    this.renderer.setStyle(this.tooltipElement, 'padding', '5px 10px');
    this.renderer.setStyle(this.tooltipElement, 'border-radius', '4px');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '1000');
    this.renderer.setStyle(this.tooltipElement, 'white-space', 'nowrap');
    this.renderer.setStyle(this.tooltipElement, 'font-size', '14px');
    this.renderer.setStyle(this.tooltipElement, 'opacity', '0'); // 초기 투명도 설정
    this.renderer.setStyle(this.tooltipElement, 'transform', 'scale(0.8)'); // 초기 크기 설정
    this.renderer.setStyle(
      this.tooltipElement,
      'transition',
      'opacity 0.1s ease, transform 0.1s ease',
    );
    this.renderer.setProperty(this.tooltipElement, 'innerText', this.text());

    this.setPosition();

    this.renderer.setStyle(this.tooltipElement, 'opacity', '0'); // 초기 투명도 설정
    this.renderer.setStyle(this.tooltipElement, 'transform', 'scale(0.8)'); // 초기 크기 설정
    this.renderer.setStyle(
      this.tooltipElement,
      'transition',
      'opacity 0.1s ease, transform 0.1s ease',
    );

    // 애니메이션 적용
    setTimeout(() => {
      this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
      this.renderer.setStyle(this.tooltipElement, 'transform', 'scale(1)');
    }, 10); // 브라우저 렌더링을 고려해 약간의 지연 추가
  }

  // 마우스를 요소에서 뗄 때 애니메이션 적용
  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltipElement) {
      this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
      this.renderer.setStyle(this.tooltipElement, 'transform', 'scale(0.8)');
    }

    setTimeout(() => {
      if (this.tooltipElement) {
        this.renderer.removeChild(document.body, this.tooltipElement);
        this.tooltipElement = null;
      }
    }, 100); // 애니메이션이 끝나면 제거
  }

  private setPosition() {
    if (!this.tooltipElement) return;

    const hostPos = this.el.nativeElement.getBoundingClientRect();
    const tooltipPos = this.tooltipElement.getBoundingClientRect();

    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    let top = 0;
    let left = 0;

    switch (this.tooltipPosition()) {
      case 'top':
        top = hostPos.top + scrollY - tooltipPos.height - this.margin();
        left = hostPos.left + scrollX + (hostPos.width - tooltipPos.width) / 2;
        break;
      case 'bottom':
        top = hostPos.bottom + scrollY + this.margin();
        left = hostPos.left + scrollX + (hostPos.width - tooltipPos.width) / 2;
        break;
      case 'left':
        top = hostPos.top + scrollY + (hostPos.height - tooltipPos.height) / 2;
        left = hostPos.left + scrollX - tooltipPos.width - this.margin();
        break;
      case 'right':
        top = hostPos.top + scrollY + (hostPos.height - tooltipPos.height) / 2;
        left = hostPos.right + scrollX + this.margin();
        break;
      default:
        top = hostPos.top + scrollY - tooltipPos.height - this.margin();
        left = hostPos.left + scrollX + (hostPos.width - tooltipPos.width) / 2;
        break;
    }

    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
  }
}
