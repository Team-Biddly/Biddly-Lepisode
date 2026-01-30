import { Directive, ElementRef, Renderer2, HostListener } from "@angular/core";

@Directive({
  selector: "[appButtonPress]",
})
export class ButtonPressDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener("mousedown") onMouseDown() {
    // 버튼을 살짝 작아지게
    this.renderer.setStyle(this.el.nativeElement, "transform", "scale(0.8)");
    this.renderer.setStyle(
      this.el.nativeElement,
      "transition",
      "transform 0.3s ease"
    );
  }

  @HostListener("mouseup") onMouseUp() {
    // 버튼을 원래 크기로
    this.renderer.setStyle(this.el.nativeElement, "transform", "scale(1)");
  }

  @HostListener("mouseleave") onMouseLeave() {
    // 마우스가 버튼 밖으로 나갔을 때도 원래 크기로
    this.renderer.setStyle(this.el.nativeElement, "transform", "scale(1)");
  }
}
