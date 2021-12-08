import { Component, Input, OnInit } from '@angular/core';
import { HomeWorkType } from 'src/app/store/models/calendar.type';

@Component({
  selector: 'app-homework',
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.scss']
})
export class HomeworkComponent implements OnInit {
  @Input() homework: HomeWorkType;

  constructor() { }

  ngOnInit(): void {
  }

}
