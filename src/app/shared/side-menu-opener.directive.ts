import { Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSideMenuOpener]'
})
export class SideMenuOpenerDirective implements OnInit {
  @Input('appSideMenuOpener') sidemenuRef;
  @Input('appSideMenuElRef') sidemenuElRef;
  @Input('appShouldOpen') shouldOpen = true;
  @Output('onOpen') onOpen = new EventEmitter();
  @Output('onClose') onClose = new EventEmitter();

  preventOpening = false;
  preventClosing = false;
  left: number;
  triggerArea = 50;

  get sideMenuWidth() {
    let sidemenuEl = this.sidemenuElRef.nativeElement.querySelector('.ui.side-menu');
    return sidemenuEl.clientWidth;
  }

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
  ) { }

  ngOnInit() {
  }

  @HostListener('panstart', ['$event']) onPanStart(event) {
    this.sidemenuRef.enableTransition = false;
  }

  @HostListener('panmove', ['$event']) onPan(event) {
    this.moveSideMenu(event, this.shouldOpen);
  }

  moveSideMenu(event, open) {
    const panStartX = event.center.x - event.deltaX
    let left = open ? event.deltaX : event.center.x;
    // check if pan started on left edge of view
    this.preventOpening = false;
    this.preventClosing = false;
    if (open && (panStartX > this.triggerArea)) {
      this.preventOpening = true;
      return;
    }
    if (!open && panStartX <= this.sideMenuWidth) {
      left = this.sideMenuWidth;
      this.preventClosing = true;
    }
    if (!open && left > this.sideMenuWidth) {
      this.preventClosing = true;
    }
    this.left = left;
    const progress = Math.min(left / this.sideMenuWidth, 1);
    this.sidemenuRef.panProgress = progress;
  }

  @HostListener('panend', ['$event'])
  @HostListener('pancancel', ['$event'])
  onPanEnd(event) {
    const triggeredOpening = this.left > (this.sideMenuWidth / 3) && event.velocityX > -0.05 || event.velocityX > 0.2;
    const triggeredClosing = this.left < (this.sideMenuWidth * 2/3 ) && event.velocityX < 0.05 || event.velocityX < -0.2;
    if (this.shouldOpen && triggeredOpening && !this.preventOpening) {
      this.onOpen.emit();
    }
    else if (!this.shouldOpen && triggeredClosing && !this.preventClosing) {
      this.onClose.emit();
    }
    this.sidemenuRef.panProgress = null;
    this.sidemenuRef.enableTransition = true;
  }
}
