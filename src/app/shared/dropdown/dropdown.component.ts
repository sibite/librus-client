import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {
  @ViewChild('dropdownButton') buttonEl: ElementRef;
  @ViewChild('dropdownContent') contentEl: ElementRef;
  public isOpened = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggle() {
    this.isOpened = !this.isOpened;
  }

  select(event, option) {
    this.isOpened = false;
  }
}
