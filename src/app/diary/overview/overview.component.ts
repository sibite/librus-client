import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { toDateString } from 'src/app/shared/date-utilities';
import { LuckyNumberType } from 'src/app/store/models/lucky-number.type';
import { TimetableEntryType } from 'src/app/store/models/timetable.type';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
  public luckyNumber: LuckyNumberType;
  public currentLesson: TimetableEntryType;
  public nextLesson: TimetableEntryType;
  public timeline: any;

  private storeSub: Subscription;
  private lessonsRefreshInterval;

  constructor(
    private storeService: StoreService
  ) { }

  ngOnInit(): void {
    this.storeSub = this.storeService.dataSyncSubject.subscribe(data => {
      if (data.luckyNumber) {
        this.luckyNumber = data.luckyNumber;
        console.log(this.luckyNumber);
      }
      this.timeline  = this.storeService.getTimeline();
    });

    this.refreshLessons();
    this.lessonsRefreshInterval = setInterval(() => this.refreshLessons(), 10e3);
  }

  refreshLessons() {
    if (!this.storeService.data?.timetableDays
        || !this.storeService.data?.unitInfo?.school?.LessonsRange) return;

    let now = new Date();
    now = new Date(2021, 11, 8, 12, 0, 0);
    let minutes = now.getHours() * 60 + now.getMinutes();
    const todayDateString = toDateString(new Date());
    const lessonRangeBlocks = this.storeService.data.timetableDays[todayDateString] || [];
    const lessonRanges = this.storeService.data.unitInfo.school.LessonsRange;

    const lessons = [].concat(...lessonRangeBlocks).filter(lesson => !lesson.IsCanceled);

    let currentLesson = lessons.find((lesson: TimetableEntryType) => {
      const lessonRange =  lessonRanges[lesson.LessonNo];
      return minutes > lessonRange.RawFrom && minutes < lessonRange.RawTo;
    });

    let nextLesson = lessons[lessons.indexOf(currentLesson) + 1];

    this.currentLesson = currentLesson;
    this.nextLesson = nextLesson;
    console.log(currentLesson, nextLesson);
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
    clearInterval(this.lessonsRefreshInterval);
  }
}
