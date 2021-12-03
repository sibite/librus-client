import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { convertLibrusDate } from 'src/app/shared/date-converter';
import { CalendarEntryType, CalendarType, HomeWorkType } from 'src/app/store/models/calendar.type';
import { LessonRangeType } from 'src/app/store/models/lesson-range.type';
import { SubjectType } from 'src/app/store/models/subject.type';
import { TimetableEntryType } from 'src/app/store/models/timetable.type';
import { StoreService } from 'src/app/store/store.service';

interface EventCommonType {
  [key: string]: any,
  Kind: string,
  Name: string,
  DateFrom: string,
  DateTo: string,
  TimeFrom?: string,
  TimeTo?: string,
  Room?: string
}

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
  // for displaying homeworks
  private subjects: SubjectType[];
  // for displaying events
  public eventKindNames = {
    'TeacherFreeDays': 'Nieobecność nauczyciela',
    'ClassFreeDays': 'Nieobecność klasy',
    'SchoolFreeDays': 'Dodatkowy dzień wolny',
    'ParentTeacherConferences': 'Spotkanie z rodzicami'
  }

  private storeSub: Subscription;

  constructor(
    private storeService: StoreService,
    private elRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.storeSub = this.storeService.dataSyncSubject.subscribe(data => {
      if (!data.unitInfo) return;
      this.lessonsRange = data.unitInfo.school.LessonsRange;
      this.subjectColors = data.subjectColors;
      this.subjects = data.gradeSubjects;
      let lastIndex = data.unitInfo.school.LessonsRange.length - 1;
      this.dayStartRange = data.unitInfo.school.LessonsRange[1].RawFrom;
      this.dayEndRange = data.unitInfo.school.LessonsRange[lastIndex].RawTo;
      setTimeout(() => {
        let firstLesson = this.elRef.nativeElement.querySelector('.entry.lesson');
        let firstLessonY = firstLesson.getBoundingClientRect().top - this.elRef.nativeElement.getBoundingClientRect().top;
        this.elRef.nativeElement.scrollTop = firstLessonY - 10;
      }, 20);
    });

    for (let i = 0; i <= 24; i++) {
      this.timeTags.push(String(i).padStart(2, '0') + ':00');
    }
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }

  getHomeworks(lessonNo: number): HomeWorkType[] {
    return (<HomeWorkType[]>this.calendar).filter(a => a.Kind == "HomeWorks" && +a.LessonNo == lessonNo);
  }

  getEvents(): EventCommonType[] {
    return <EventCommonType[]>this.calendar.filter(a => a.Kind != 'HomeWorks' && a.Kind != 'Substitutions');
  }

}
