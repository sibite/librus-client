import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ViewService } from '../shared/view.service';
import { SideMenuComponent } from '../side-menu/side-menu.component';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss']
})
export class DiaryComponent implements OnInit {
  isSidemenuOpened = false;
  @ViewChild(SideMenuComponent, {read: ElementRef, static: true}) sidemenuElRef: ElementRef;

  constructor(
    public viewService: ViewService
  ) { }

  ngOnInit(): void {
  }

  onCloseSidemenu() {
    this.isSidemenuOpened = false;
  }

  onOpenSidemenu() {
    this.isSidemenuOpened = true;
  }

}
