import { Directive, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2 } from "@angular/core";
import { ViewService } from "./view.service";

@Directive({
  selector: '[appClickEffect]'
})
export class ClickEffectDirective implements OnInit {
  @Input('forceRippleTheme') forcedTheme = null;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private viewService: ViewService
  ) {}

  ngOnInit() {
    this.renderer.addClass(this.elRef.nativeElement, 'click-effect');
    if (!this.forcedTheme) return
    this.renderer.addClass(this.elRef.nativeElement, 'force-' + this.forcedTheme);
  }


  @HostListener('pointerdown', ['$event']) onPointerDown(event: PointerEvent) {
    if (event.target !== this.elRef.nativeElement) return;
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
    void this.elRef.nativeElement.offsetWidth;
    this.renderer.addClass(this.elRef.nativeElement, 'ce-held');
  }

  @HostListener('pointercancel')
  @HostListener('pointerout')
  @HostListener('pointerup')
  onPointerUp() {
    this.renderer.addClass(this.elRef.nativeElement, 'ce-released');
  }
}
