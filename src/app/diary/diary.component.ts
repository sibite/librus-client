import { Component, OnInit } from '@angular/core';
import { ViewService } from '../shared/view.service';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss']
})
export class DiaryComponent implements OnInit {
  isSidemenuOpened = false;

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
