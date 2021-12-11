import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { convertLibrusDate, formatDate, toDateString } from 'src/app/shared/date-utilities';
import { ViewService } from 'src/app/shared/view.service';
import { AttendanceType } from 'src/app/store/models/attendance.type';
import { AnyCalendarEntryType, CalendarKindNames } from 'src/app/store/models/calendar.type';
import { GradeKindNames, GradeType } from 'src/app/store/models/grade.type';
import { LessonRangeType } from 'src/app/store/models/lesson-range.type';
import { LuckyNumberType } from 'src/app/store/models/lucky-number.type';
import { TimetableEntryType } from 'src/app/store/models/timetable.type';
import { StoreService } from 'src/app/store/store.service';
import { getAttendanceDetailsHTML } from '../attendances/attendance-properties';
import { getGradeDetailsHTML } from '../grades/grade-properties';
import { getEventDetailsHTML } from '../plan/event-properties';
import { getLessonDetailsHTML } from '../plan/lesson-properties';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
  public subjectColors: { [key: number]: string };
  public lessonsRange: LessonRangeType[];

  public luckyNumber: LuckyNumberType;
  public currentLesson: TimetableEntryType;
  public nextLesson: TimetableEntryType;
  private timelineSrc: any;
  public timeline: any;
  public timelineDates: string[];

  public calendarKindNames = CalendarKindNames;
  public gradeKindNames = GradeKindNames;

  private storeSub: Subscription;
  private lessonsRefreshInterval;

  constructor(
    public hostElRef: ElementRef,
    private storeService: StoreService,
    private viewService: ViewService
  ) { }

  ngOnInit(): void {
    this.storeSub = this.storeService.dataSyncSubject.subscribe(data => {
      if (data.luckyNumber) {
        this.luckyNumber = data.luckyNumber;
      }
      if (data.subjectColors) {
        this.subjectColors = data.subjectColors;
      }
      this.lessonsRange = data.unitInfo?.school?.LessonsRange || [];
      this.timelineSrc  = data.timeline || [];
      // generate date strings
      this.timelineDates = [];
      for (let entry of this.timelineSrc) {
        this.timelineDates.push(this.getEntryDateStr(entry));
      }
      this.timeline = this.timelineSrc.slice(0, 10);
    });

    this.refreshLessons();
    this.lessonsRefreshInterval = setInterval(() => this.refreshLessons(), 10e3);
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
    clearInterval(this.lessonsRefreshInterval);
  }

  refreshLessons() {
    if (!this.storeService.data?.timetableDays
        || !this.storeService.data?.unitInfo?.school?.LessonsRange) return;

    let now = new Date();
    let minutes = now.getHours() * 60 + now.getMinutes();
    const todayDateString = toDateString(now);
    const lessonRangeBlocks = this.storeService.data.timetableDays[todayDateString] || [];
    const lessonRanges = this.storeService.data.unitInfo.school.LessonsRange;

    const lessons = [].concat(...lessonRangeBlocks).filter(lesson => !lesson.IsCanceled);

    if (!lessons.length) return;

    let currentLesson = lessons.find((lesson: TimetableEntryType) => {
      const lessonRange =  lessonRanges[lesson.LessonNo];
      return minutes >= lessonRange.RawFrom && minutes < lessonRange.RawTo;
    });

    let nextLesson;
    const firstLesson = lessons[0];
    const lastLesson = lessons[lessons.length - 1];

    // if time is before first lesson
    if (minutes < +lessonRanges[firstLesson.LessonNo].RawFrom) {
      nextLesson = firstLesson;
    }
    // if time is before last lesson
    else if (minutes < +lessonRanges[lastLesson.LessonNo].RawFrom) {
      nextLesson = lessons.find((lesson: TimetableEntryType, index) => {
        const currentLessonRange =  lessonRanges[+lessons[index - 1]?.LessonNo] || { RawFrom: 0 };
        const nextLessonRange =  lessonRanges[+lesson.LessonNo];
        return minutes >= currentLessonRange.RawFrom && minutes < nextLessonRange.RawFrom;
      });
    }

    this.currentLesson = currentLesson;
    this.nextLesson = nextLesson;
  }



  onReachTimelineEnd() {
    this.timeline = this.timelineSrc.slice(0, this.timeline.length + 10);
  }



  getLuckyNumberDateStr(luckyNumber: LuckyNumberType) {
    return formatDate(convertLibrusDate(luckyNumber?.LuckyNumberDay), 'long weekday');
  }

  getEntryDateStr(entry: AnyCalendarEntryType) {
    if (!entry) return;

    const addDate = convertLibrusDate(entry.AddDate);
    let mDate = moment(addDate);
    mDate.locale('pl');
    const diff = moment.duration(moment().diff(mDate));

    if (diff.asDays() >= 7) {
      return formatDate(addDate, 'long month');
    }
    else {
      return mDate.fromNow();
    }
  }



  showLessonDetails(mouseEvent: MouseEvent, lesson: TimetableEntryType) {
    console.log(lesson);
    this.viewService.popUpSubject.next({
      title: 'Lekcja',
      content: getLessonDetailsHTML(lesson)
    })
    mouseEvent.stopPropagation();
  }

  showGradeDetails(grade: GradeType) {
    console.log(grade);
    this.viewService.popUpSubject.next({
      title: 'Szczegóły',
      content: getGradeDetailsHTML(grade)
    })
  }

  showAttendanceDetails(attendance: AttendanceType) {
    console.log(attendance);
    this.viewService.popUpSubject.next({
      title: 'Szczegóły',
      content: getAttendanceDetailsHTML(attendance)
    })
  }

  showEventDetails(event: AnyCalendarEntryType) {
    console.log(event);
    this.viewService.popUpSubject.next({
      title: 'Szczegóły',
      content: getEventDetailsHTML(event)
    })
  }

  onRefreshGesture() {
    if (!this.storeService.syncState.syncing) {
      this.storeService.synchronize();
    }
  }
}
