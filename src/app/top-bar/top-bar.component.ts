import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopbarComponent implements OnInit {
  @Input() uiTitle: string;
  @Input() appIcon: string;
  @Output() onButtonClick = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
