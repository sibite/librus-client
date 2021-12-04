import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ViewService } from '../view.service';
import { StoreService } from '../../store/store.service';
import * as moment from 'moment';
import { NavigationStart, Router } from '@angular/router';

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

  public lastSyncText: string;

  get sideMenuWidth() {
    let sidemenuEl = this.sidemenuElRef.nativeElement;
    return sidemenuEl.clientWidth;
  }
  isBeingPanned = false;

  constructor(
    public viewService: ViewService,
    private authService: AuthService,
    private storeService: StoreService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setLastSyncText();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.onClose.emit();
      }
    });
  }

  onOverlayClick() {
    if (!this.isBeingPanned) {
      this.onClose.emit();
    }
    this.isBeingPanned = false;
  }

  onSyncClick() {
    this.onClose.emit();
    this.storeService.data.timetablesLastSync = {};
    this.storeService.synchronize();
  }

  getAuthState() {
    return this.authService.authState;
  }

  getStoreData() {
    return this.storeService.getData();
  }

  setLastSyncText() {
    let lastSyncDate = moment(this.storeService.data.lastSyncTime);
    lastSyncDate.locale('pl');
    this.lastSyncText = lastSyncDate.fromNow();
    setTimeout(this.setLastSyncText.bind(this), 3e3);
  }

}
