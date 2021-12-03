import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { convertLibrusDate, toDateString, toMiddayDate } from 'src/app/shared/date-converter';
import { CalendarEntryType, CalendarType } from 'src/app/store/models/calendar.type';
import { TimetableEntryType } from 'src/app/store/models/timetable.type';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit, OnDestroy {
  public day: string;
  public timetableDays: { [key: string]: TimetableEntryType[][] } = {};
  public calendar: { [key: string]: CalendarEntryType[] } = {};

  private storeSub: Subscription;

  constructor(
    private storeService: StoreService
  ) { }

  ngOnInit(): void {
    this.storeSub = this.storeService.dataSyncSubject.subscribe(data => {
      if (!data.timetableDays) return;
      this.timetableDays = data.timetableDays;
      this.calendar = data.calendar;
      let now = new Date();
      this.day = toDateString(toMiddayDate(now));
      this.storeService.loadTimetable(convertLibrusDate(this.day));
    });
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }

}
