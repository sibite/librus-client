import { AfterViewChecked, Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from "@angular/core";

@Directive({
  selector: '[appRefreshGesture]'
})
export class RefreshGestureDirective implements OnInit {
  @Input('appRefreshGesture') mode: 'parent' | '';
  @Output('onRefreshGesture') onRefreshGesture = new EventEmitter();

  hostEl: HTMLElement;
  pointerStartY: number = 0;
  pointerStartX: number = 0;
  pointerEndY: number;
  allowGesture = true;
  firstMoveWasDown: boolean = null;
  indicatorMaxTop = 90;
  indicatorEl: ChildNode;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    let container = document.createElement('div');
    container.innerHTML = `<div class="ui refresh-indicator"><i class="bi-arrow-clockwise"></i></div>`;
    this.indicatorEl = container.firstChild;

    this.hostEl = this.mode == 'parent' ? this.elRef.nativeElement.parentNode : this.elRef.nativeElement;
    this.hostEl.style.setProperty('--max-progress', '' + this.indicatorMaxTop);
    this.renderer.setStyle(this.hostEl, 'position', 'relative');
    this.renderer.appendChild(this.hostEl, this.indicatorEl);
  }

  // On touch start

  @HostListener('touchstart', ['$event'])
  onPanStart(event: TouchEvent) {
    if (this.hostEl.scrollTop == 0 && this.allowGesture) {
      this.setProgress(0);
      this.pointerStartY = event.touches[0].screenY;
      this.pointerStartX = event.touches[0].screenX;
      this.renderer.removeClass(this.indicatorEl, 'after-pull');
      this.renderer.addClass(this.indicatorEl, 'pulled');
    } else {
      this.pointerStartY = null;
    }
  }

  // On touch move

  @HostListener('touchmove', ['$event'])
  onPointerMove(event: TouchEvent) {
    if (this.pointerStartY === null || this.firstMoveWasDown === false) return;
    const diffY = Math.max(0, event.touches[0].screenY - this.pointerStartY);
    const diffX = Math.max(0, event.touches[0].screenX - this.pointerStartX);
    const wasVertical = diffY > 0 && Math.abs(diffY / diffX) > 1.2;

    if (this.firstMoveWasDown === null && diffY > 0 && wasVertical) {
      this.firstMoveWasDown = true;
    }
    else if (this.firstMoveWasDown === null && (diffY <= 0 || !wasVertical)) {
      this.firstMoveWasDown = false;
      return;
    }

    this.pointerEndY = event.touches[0].screenY;
    const progress = this.getProgress(diffY);
    this.setProgress(progress);
  }

  // On touch end

  @HostListener('touchend', ['$event'])
  @HostListener('touchcancel')
  onPanEnd(event) {
    const diff = Math.max(0, this.pointerEndY - this.pointerStartY);
    const progress = this.getProgress(diff);
    if (progress > this.indicatorMaxTop * 1.1 && this.pointerStartY) {
      this.renderer.addClass(this.indicatorEl, 'after-pull');
      this.onRefreshGesture.emit();
      this.allowGesture = false;
      setTimeout(() => this.allowGesture = true, 2500);
    }
    this.renderer.removeClass(this.indicatorEl, 'pulled');
    this.renderer.removeStyle(this.hostEl, 'touch-action');
    this.pointerStartY = null;
    this.pointerStartX = null;
    this.pointerEndY = null;
    this.firstMoveWasDown = null;
  }

  getProgress(diff: number) {
    const b = this.indicatorMaxTop + 160;
    return (diff * b) / (diff + b); // harmonic mean
  }

  setProgress(progress: number) {
    this.hostEl.style.setProperty('--progress', '' + progress);
  }
}
