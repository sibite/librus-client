import { Directive, ElementRef, EventEmitter, Host, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSideMenuOpener]'
})
export class SideMenuOpenerDirective implements OnInit {
  @Input('appSideMenuOpener') sidemenuRef;
  @Input('appShouldOpen') shouldOpen = true;
  @Output('onOpen') onOpen = new EventEmitter();
  @Output('onClose') onClose = new EventEmitter();

  sideMenuWidth = +getComputedStyle(document.body).getPropertyValue('--side-menu-width').slice(0, -2);
  preventOpening = false;
  preventClosing = false;
  preventClick = false;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
  ) { }

  ngOnInit() {
  }

  @HostListener('panstart') onPanStart() {
    this.sidemenuRef.enableTransition = false;
  }

  @HostListener('panright', ['$event']) onPanRight(event) {
    this.moveSideMenu(event, this.shouldOpen);
  }

  @HostListener('panleft', ['$event']) onPanLeft(event) {
    this.moveSideMenu(event, this.shouldOpen);
  }

  moveSideMenu(event, open) {
    const panStartX = event.center.x - event.deltaX
    let left = open ? event.deltaX : event.center.x;
    // check if pan started on left edge of view
    this.preventOpening = false;
    this.preventClosing = false;
    if (open && (panStartX > 35)) {
      this.preventOpening = true;
      return;
    }
    if (!open && left > this.sideMenuWidth) {
      this.preventClosing = true;
    }
    const progress = Math.min(left / this.sideMenuWidth, 1);
    this.sidemenuRef.panProgress = progress;
  }

  @HostListener('click', ['$event']) onClick(event) {
    if (!this.preventClick) this.onClose.emit();
    this.preventClick = false;
  }

  @HostListener('panend', ['$event'])
  @HostListener('pancancel', ['$event'])
  onPanEnd(event) {
    const triggeredOpening = event.deltaX > (this.sideMenuWidth / 3) && event.velocityX > -0.05 || event.velocityX > 0.2;
    const triggeredClosing = event.center.x < (this.sideMenuWidth * 2/3 ) && event.velocityX < 0.05 || event.velocityX < -0.2;
    if (this.shouldOpen && triggeredOpening && !this.preventOpening) {
      this.onOpen.emit();
    }
    else if (!this.shouldOpen && triggeredClosing && !this.preventClosing) {
      this.onClose.emit();
    }
    this.preventClick = true;
    this.sidemenuRef.panProgress = null;
    this.sidemenuRef.enableTransition = true;
  }
}
