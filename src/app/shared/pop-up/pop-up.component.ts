import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ViewService } from '../view.service';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss']
})
export class PopUpComponent implements OnInit {
  @Input() windowTitle: string = "Pop-up";
  @Input() windowContent: any = "...";
  @Output() onClose = new EventEmitter<any>();

  constructor(
    public viewService: ViewService
  ) { }

  ngOnInit(): void {
  }
}
