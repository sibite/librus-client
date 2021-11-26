import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from "@angular/core";

@Directive({
  selector: '[appClickEffect]'
})
export class ClickEffectDirective implements OnInit {
  @Input('forceRippleTheme') forcedTheme = null;
  pointerDownTimeout;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.renderer.addClass(this.elRef.nativeElement, 'click-effect');
    if (!this.forcedTheme) return
    this.renderer.addClass(this.elRef.nativeElement, 'force-' + this.forcedTheme);
  }

  @HostListener('pointermove', ['$event']) onMove(event) {
    clearTimeout(this.pointerDownTimeout);
  }


  @HostListener('pointerdown', ['$event']) onPointerDown(event: PointerEvent) {
    const isDisabled = this.elRef.nativeElement.disabled;
    if (event.target !== this.elRef.nativeElement || isDisabled) return;
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
    this.renderer.removeClass(this.elRef.nativeElement, 'ce-held');
    this.renderer.removeClass(this.elRef.nativeElement, 'ce-released');
    this.pointerDownTimeout = setTimeout(
      () => this.renderer.addClass(this.elRef.nativeElement, 'ce-held'), 80
    );
  }

  @HostListener('pointerout')
  @HostListener('pointerup')
  @HostListener('click')
  onPointerUp() {
    this.renderer.addClass(this.elRef.nativeElement, 'ce-released');
  }
}
