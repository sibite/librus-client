import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() appSelf;
  @Output() onClose = new EventEmitter();

  sideMenuWidth = +getComputedStyle(document.body).getPropertyValue('--side-menu-width').slice(0, -2);

  constructor(
    public viewService: ViewService,
    private authService: AuthService,
    private storeService: StoreService
  ) { }

  ngOnInit(): void {
  }

  getAuthState() {
    return this.authService.authState;
  }

  getStoreData() {
    return this.storeService.getData();
  }

}
