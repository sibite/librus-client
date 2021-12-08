import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { toMiddayDate } from 'src/app/shared/date-utilities';
import { ViewService } from 'src/app/shared/view.service';
import { AnyCalendarEntryType, CalendarEntryType, HomeWorkType } from 'src/app/store/models/calendar.type';
import { LessonRangeType } from 'src/app/store/models/lesson-range.type';
import { TimetableEntryType } from 'src/app/store/models/timetable.type';
import { StoreService } from 'src/app/store/store.service';
import { getEventDetailsHTML } from '../event-properties';
import { getLessonDetailsHTML } from '../lesson-properties';

@Component({
  selector: 'app-lessons-list',
  templateUrl: './lessons-list.component.html',
  styleUrls: ['./lessons-list.component.scss']
})
export class LessonsListComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  @Input() timetable: TimetableEntryType[][];
  @Input() calendar: CalendarEntryType[];
  @Input() $onDatePick: BehaviorSubject<Date>;
  @ViewChild('lessonsContainer') lessonsContRef: ElementRef;

  private autoScrollRequested = false;

  public date: Date;
  public minutes: number;
  public homeworks: { [key: number]: HomeWorkType[] } = {};
  public lessonsRange: LessonRangeType[];
  public subjectColors: { [key: number]: string };
  public dayStartRange: number = 0;
  public dayEndRange: number = 1440
  public timeTags: string[] = [];

  private storeSub: Subscription;
  private datePickSub: Subscription;
  private minutesInterval;

  constructor(
    private storeService: StoreService,
    private viewService: ViewService,
    private elRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.storeSub = this.storeService.dataSyncSubject.subscribe(data => {
      if (!data.unitInfo) return;
      this.lessonsRange = data.unitInfo.school?.LessonsRange || [];
      this.subjectColors = data.subjectColors;
      let lastIndex = this.lessonsRange.length - 1;
      this.dayStartRange = this.lessonsRange[1]?.RawFrom || 0;
      this.dayEndRange = this.lessonsRange[lastIndex]?.RawTo || 1440;
    });

    // ONLY TEMPORARY UNTIL ARE GESTURES IMPLEMENTED
    this.datePickSub = this.$onDatePick.subscribe(date => {
      this.date = date;
      this.autoScrollRequested = true;
      this.refreshMinutes();
    });

    // appending time tags behind the lessons plan
    for (let i = 0; i <= 24; i++) {
      this.timeTags.push(String(i).padStart(2, '0') + ':00');
    }

    // displaying current time bar
    this.minutesInterval = setInterval(() => this.refreshMinutes(), 10e3);
  }

  ngAfterViewInit() {
    this.autoScroll();
  }

  ngAfterViewChecked() {
    if (this.autoScrollRequested) {
      this.autoScroll();
      this.autoScrollRequested = false;
    }
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
    this.datePickSub.unsubscribe();
    clearInterval(this.minutesInterval);
  }

  refreshMinutes() {
    let now = new Date();
    this.minutes = now.getHours() * 60 + now.getMinutes();
    if (toMiddayDate(now).getTime() !== toMiddayDate(this.date).getTime()) {
      this.minutes = null;
    }
  }

  autoScroll() {
    const firstLesson = this.lessonsContRef.nativeElement.querySelector('.entry.lesson');
    const firstLessonTop = firstLesson?.getBoundingClientRect().top;
    const elRefTop = this.elRef.nativeElement.getBoundingClientRect().top;
    this.elRef.nativeElement.scrollTop += firstLessonTop - elRefTop - 10;
  }

  showEventDetails(mouseEvent: MouseEvent, event: AnyCalendarEntryType) {
    console.log(event);
    this.viewService.popUpSubject.next({
      title: 'Szczegóły',
      content: getEventDetailsHTML(event)
    })
    mouseEvent.stopPropagation();
  }

  showLessonDetails(mouseEvent: MouseEvent, lesson: TimetableEntryType) {
    console.log(lesson);
    this.viewService.popUpSubject.next({
      title: 'Lekcja',
      content: getLessonDetailsHTML(lesson)
    })
    mouseEvent.stopPropagation();
  }

  getHomeworks(lessonNo: number): HomeWorkType[] {
    return (<HomeWorkType[]>this.calendar).filter(a => a.Kind == "HomeWorks" && +a.LessonNo == lessonNo);
  }

  getEvents(): AnyCalendarEntryType[] {
    return <AnyCalendarEntryType[]>this.calendar.filter(a => a.Kind != 'HomeWorks' && a.Kind != 'Substitutions');
  }

}
