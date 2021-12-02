import { Component, Input, OnInit } from '@angular/core';
import { LessonRangeType } from 'src/app/store/models/lesson-range.type';
import { TimetableEntryType } from 'src/app/store/models/timetable.type';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-lessons-list',
  templateUrl: './lessons-list.component.html',
  styleUrls: ['./lessons-list.component.scss']
})
export class LessonsListComponent implements OnInit {
  @Input() timetable: TimetableEntryType[][];
  public lessonsRange: LessonRangeType[];
  public subjectColors: { [key: number]: string };
  public dayStartRange: number = 0;
  public dayEndRange: number = 1440
  public timeTags: string[] = [];

  constructor(
    private storeService: StoreService
  ) { }

  ngOnInit(): void {
    this.storeService.dataSyncSubject.subscribe(data => {
      if (!data.unitInfo) return;
      this.lessonsRange = data.unitInfo.school.LessonsRange;
      this.subjectColors = data.subjectColors;
      let lastIndex = data.unitInfo.school.LessonsRange.length - 1;
      this.dayStartRange = data.unitInfo.school.LessonsRange[1].RawFrom;
      this.dayEndRange = data.unitInfo.school.LessonsRange[lastIndex].RawTo;
    });

    for (let i = 0; i <= 24; i++) {
      this.timeTags.push(String(i).padStart(2, '0') + ':00');
    }
  }

}
