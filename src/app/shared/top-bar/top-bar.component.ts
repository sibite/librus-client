import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../../store/store.service';

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
