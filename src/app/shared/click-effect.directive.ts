import { Directive, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2 } from "@angular/core";

@Directive({
  selector: '[clickEffect]'
})
export class ClickEffectDirective implements OnInit {
  @Input('forceRippleTheme') forcedTheme = null;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.renderer.addClass(this.elRef.nativeElement, 'click-effect');
    console.log(this.forcedTheme);
    if (this.forcedTheme) {
      this.renderer.addClass(this.elRef.nativeElement, 'force-' + this.forcedTheme);
    }
  }


  @HostListener('click', ['$event']) onClick(event: PointerEvent) {
    const elWidth = this.elRef.nativeElement.clientWidth;
    const elHeight = this.elRef.nativeElement.clientHeight;
    const clickX = event.offsetX;
    const clickY = event.offsetY;
    const lengthPower = Math.max(
      Math.pow(elWidth - clickX, 2) + Math.pow(elHeight - clickY, 2),
      Math.pow(clickX, 2) + Math.pow(elHeight - clickY, 2),
      Math.pow(clickX, 2) + Math.pow(clickY, 2),
      Math.pow(elWidth - clickX, 2) + Math.pow(clickY, 2)
      );
    const rippleSize = Math.sqrt(lengthPower) * 2;
    this.elRef.nativeElement.style.setProperty('--ripple-size', rippleSize + 'px');
    this.elRef.nativeElement.style.setProperty('--ripple-x', clickX + 'px');
    this.elRef.nativeElement.style.setProperty('--ripple-y', clickY + 'px');
    this.renderer.removeClass(this.elRef.nativeElement, 'clicked');
    void this.elRef.nativeElement.offsetWidth;
    this.renderer.addClass(this.elRef.nativeElement, 'clicked');
  }
}
