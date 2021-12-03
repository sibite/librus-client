import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ViewService } from 'src/app/shared/view.service';
import { AnyCalendarEntryType, CalendarEntryType, HomeWorkType } from 'src/app/store/models/calendar.type';
import { LessonRangeType } from 'src/app/store/models/lesson-range.type';
import { SubjectType } from 'src/app/store/models/subject.type';
import { TimetableEntryType } from 'src/app/store/models/timetable.type';
import { StoreService } from 'src/app/store/store.service';
import { eventKindNames, getEventDetailsHTML } from '../event-properties';
import { getLessonDetailsHTML } from '../lesson-properties';

@Component({
  selector: 'app-lessons-list',
  templateUrl: './lessons-list.component.html',
  styleUrls: ['./lessons-list.component.scss']
})
export class LessonsListComponent implements OnInit, OnDestroy {
  @Input() timetable: TimetableEntryType[][];
  @Input() calendar: CalendarEntryType[];

  public homeworks: { [key: number]: HomeWorkType[] } = {};
  public lessonsRange: LessonRangeType[];
  public subjectColors: { [key: number]: string };
  public dayStartRange: number = 0;
  public dayEndRange: number = 1440
  public timeTags: string[] = [];
  // for displaying events
  public eventKindNames = eventKindNames;

  private storeSub: Subscription;
  private wasScrollSet = false;

  constructor(
    private storeService: StoreService,
    private viewService: ViewService,
    private elRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.storeSub = this.storeService.dataSyncSubject.subscribe(data => {
      if (!data.unitInfo) return;
      this.lessonsRange = data.unitInfo.school.LessonsRange;
      this.subjectColors = data.subjectColors;
      let lastIndex = data.unitInfo.school.LessonsRange.length - 1;
      this.dayStartRange = data.unitInfo.school.LessonsRange[1].RawFrom;
      this.dayEndRange = data.unitInfo.school.LessonsRange[lastIndex].RawTo;
      setTimeout(() => {
        let firstLesson = this.elRef.nativeElement.querySelector('.entry.lesson');
        let firstLessonY = firstLesson.getBoundingClientRect().top - this.elRef.nativeElement.getBoundingClientRect().top;
        if (firstLessonY > 1 && !this.wasScrollSet) {
          this.elRef.nativeElement.scrollTop = firstLessonY - 10;
          this.wasScrollSet = true;
        }
      }, 20);
    });

    for (let i = 0; i <= 24; i++) {
      this.timeTags.push(String(i).padStart(2, '0') + ':00');
    }
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
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
      title: 'Szczegóły',
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
