import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-bar-switch',
  templateUrl: './bar-switch.component.html',
  styleUrls: ['./bar-switch.component.scss']
})
export class BarSwitchComponent implements OnInit {
  @Input() options: { key: any, name: string }[];
  @Input() selectedOption: any;
  @Output() onSelect = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  select(optionKey) {
    this.selectedOption = optionKey;
    this.onSelect.emit(optionKey);
  }
}
