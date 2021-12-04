import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { convertLibrusDate, formatDate, toDateString, toMiddayDate, toWeekStartDate } from 'src/app/shared/date-converter';
import { CalendarEntryType } from 'src/app/store/models/calendar.type';
import { TimetableEntryType } from 'src/app/store/models/timetable.type';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit, OnDestroy {
  public $onDatePick = new Subject<Date>();
  public today: Date;
  public date: Date;
  public dateString: string;
  public dateDisplayString: string = '';
  public weekSlideOffset = 0;
  public timetableDays: { [key: string]: TimetableEntryType[][] } = {};
  public calendar: { [key: string]: CalendarEntryType[] } = {};
  public weekdates = [];
  public dayNames = [ 'pn', 'wt', 'śr', 'cz', 'pt', 'sb', 'nd' ];

  private storeSub: Subscription;

  constructor(
    private storeService: StoreService
  ) { }

  ngOnInit(): void {
    this.storeSub = this.storeService.dataSyncSubject.subscribe(data => {
      if (!data.timetableDays) return;
      this.timetableDays = data.timetableDays;
      this.calendar = data.calendar;
    });
    this.pickDate(new Date(2021, 11, 3));
    // set today to next day when reaches midnight
    let nextDay = new Date(Date.now() + 86400e3);
    nextDay.setHours(0, 0, 1);
    setTimeout(() => this.today = toMiddayDate(new Date()), nextDay.getTime() - Date.now());
  }

  pickDate(date: Date) {
    this.today = toMiddayDate(new Date());
    const weekStart = toWeekStartDate(date);
    this.weekSlideOffset = 0;
    this.date = toMiddayDate(date);
    this.dateString = toDateString(this.date);
    this.dateDisplayString = formatDate(date, 'long weekday-month');
    this.setWeekDates(weekStart);
    this.storeService.loadTimetable(this.date)
      .pipe(take(1))
      .subscribe(timetableDays => {
        console.log('onDatePick dispatched');
        this.$onDatePick.next(this.date);
      });
  }

  setWeekDates(weekStart: Date) {
    this.weekdates = [];
    for (let i = 0; i < 7; i++) {
      this.weekdates.push(new Date(weekStart.getTime() + 86400e3 * i));
    }
  }

  slideWeekDates(direction: -1 | 1) {
    this.weekSlideOffset += direction;
    const offset = this.weekSlideOffset;
    const adjacentWeek = toWeekStartDate(new Date(this.date.getTime() + 86400e3 * 7 * offset));
    this.setWeekDates(adjacentWeek);
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }

}
