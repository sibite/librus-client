import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ViewService } from '../shared/view.service';
import { StoreService } from '../store/store.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  @Input() isOpened = false;
  @Input() panProgress: number;
  @Input() enableTransition = true;
  @Output() onClose = new EventEmitter();
  @ViewChild('sidemenuElRef', { static: true, read: ElementRef }) sidemenuElRef: ElementRef;

  get sideMenuWidth() {
    let sidemenuEl = this.sidemenuElRef.nativeElement;
    return sidemenuEl.clientWidth;
  }
  isBeingPanned = false;

  constructor(
    public viewService: ViewService,
    private authService: AuthService,
    private storeService: StoreService
  ) { }

  ngOnInit(): void {
  }

  onOverlayClick() {
    if (!this.isBeingPanned) {
      this.onClose.emit();
    }
    this.isBeingPanned = false;
  }

  getAuthState() {
    return this.authService.authState;
  }

  getStoreData() {
    return this.storeService.getData();
  }

}
