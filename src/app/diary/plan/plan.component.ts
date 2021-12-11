import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { formatDate, toDateString, toMiddayDate, toWeekStartDate } from 'src/app/shared/date-utilities';
import { CalendarEntryType } from 'src/app/store/models/calendar.type';
import { TimetableEntryType } from 'src/app/store/models/timetable.type';
import { StoreService, SyncStateType } from 'src/app/store/store.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit, OnDestroy {
  public $onDatePick = new BehaviorSubject<Date>(new Date());
  public isUpToDate = true;
  public today: Date;
  public date: Date;
  public dateString: string;
  public dateDisplayString: string = '';
  public weekSlideOffset = 0;
  public timetableDays: { [key: string]: TimetableEntryType[][] } = {};
  public calendar: { [key: string]: CalendarEntryType[] } = {};
  public weekdates = [];
  public dayNames = [ 'pn', 'wt', 'śr', 'cz', 'pt', 'sb', 'nd' ];

  private prevSyncState: SyncStateType;
  private storeSub: Subscription;
  private syncSub: Subscription;

  constructor(
    private storeService: StoreService
  ) { }

  ngOnInit(): void {
    this.pickDate(new Date());
    // subscribing to calendar data changes
    this.storeSub = this.storeService.dataSyncSubject.subscribe(data => {
      if (!data.timetableDays || !data.calendar) return;
      this.timetableDays = data.timetableDays;
      this.calendar = data.calendar;
      this.isUpToDate = this.storeService.isTimetableDayUpToDate(this.date);
    });
    // refresh current week when syncing
    this.syncSub = this.storeService.syncStateSubject.subscribe(state => {
      console.log('plan syncstate', this.prevSyncState, state);
      if (state.syncing || !state.offline && this.prevSyncState?.offline) {
        this.loadTimetable(this.date);
      }
      this.prevSyncState = { ...state };
    })
    // set today to next day when reaches midnight
    let nextDay = new Date(Date.now() + 86400e3);
    nextDay.setHours(0, 0, 1);
    setTimeout(() => this.today = toMiddayDate(new Date()), nextDay.getTime() - Date.now());
  }

  pickDate(date: Date) {
    this.today = toMiddayDate(new Date());
    const weekStart = toWeekStartDate(date);
    this.weekSlideOffset = 0;
    this.setWeekDates(weekStart);
    this.date = toMiddayDate(date);
    this.dateString = toDateString(this.date);
    this.dateDisplayString = formatDate(date, 'long weekday-month');
    this.isUpToDate = this.storeService.isTimetableDayUpToDate(this.date);
    this.$onDatePick.next(date);
    this.loadTimetable(this.date);
  }

  loadTimetable(date: Date, force = false) {
    this.storeService.loadTimetable(date, false, force)
      .pipe(take(1))
      .subscribe(timetableDays => {
          console.log('onDatePick dispatched');
          this.isUpToDate = true;
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

  onRefreshGesture() {
    console.log('refresh');
    this.loadTimetable(this.date, true);
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
    this.syncSub.unsubscribe();
  }

}
