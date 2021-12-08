import { Component, Input, OnInit } from '@angular/core';
import { AnyCalendarEntryType } from 'src/app/store/models/calendar.type';
import { eventKindNames } from '../../event-properties';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  public eventKindNames = eventKindNames;
  @Input() event: AnyCalendarEntryType;

  constructor() { }

  ngOnInit(): void {
  }

}
