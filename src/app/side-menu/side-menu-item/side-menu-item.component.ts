import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-menu-item',
  templateUrl: './side-menu-item.component.html',
  styleUrls: ['./side-menu-item.component.scss']
})
export class SideMenuItemComponent implements OnInit {
  @Input() itemIcon: string;

  constructor() { }

  ngOnInit(): void {
  }

}
