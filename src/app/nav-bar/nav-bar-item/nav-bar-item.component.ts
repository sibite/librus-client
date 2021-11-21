import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar-item',
  templateUrl: './nav-bar-item.component.html',
  styleUrls: ['./nav-bar-item.component.scss']
})
export class NavBarItemComponent implements OnInit {
  @Input() appIcon: string;

  constructor() { }

  ngOnInit(): void {
  }

}
