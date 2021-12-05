import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from "@angular/core";
import { Subscription } from "rxjs";
import { ClickEffectService } from "./click-effect.service";

@Directive({
  selector: '[appClickEffect]'
})
export class ClickEffectDirective implements OnInit, OnDestroy {
  @Input('forceRippleTheme') forcedTheme = null;
  pointerDownTimeout;
  pointerMoveListenerFn;
  subscriptions: Subscription[] = [];

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private clickEffectService: ClickEffectService
  ) {}

  ngOnInit() {
    this.renderer.addClass(this.elRef.nativeElement, 'click-effect');
    if (this.forcedTheme) {
      this.renderer.addClass(this.elRef.nativeElement, 'force-' + this.forcedTheme);
    }

    this.subscriptions.push(this.clickEffectService.onPointerDown.subscribe((event) => {
      if (event.target == this.elRef.nativeElement) this.onPointerDown(event);
    }));

    this.subscriptions.push(this.clickEffectService.onPointerUp.subscribe(event => {
      if (event.target == this.elRef.nativeElement) this.onPointerUp();
    }));
  }

  ngOnDestroy() {
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  onPointerDown(event: PointerEvent) {
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
    // canceling if pointer moves
    const onPointerMove = () => {
      clearTimeout(this.pointerDownTimeout);
      this.elRef.nativeElement.removeEventListener('pointermove', onPointerMove);
    }
    this.elRef.nativeElement.addEventListener('pointermove', onPointerMove);
  }

  onPointerUp() {
    this.renderer.addClass(this.elRef.nativeElement, 'ce-released');
  }
}
