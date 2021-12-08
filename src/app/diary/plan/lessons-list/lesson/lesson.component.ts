import { Component, Input, OnInit } from '@angular/core';
import { LessonRangeType } from 'src/app/store/models/lesson-range.type';
import { TimetableEntryType } from 'src/app/store/models/timetable.type';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss']
})
export class LessonComponent implements OnInit {
  @Input() lesson: TimetableEntryType;
  @Input() color: string;
  @Input() range: LessonRangeType;

  constructor() { }

  ngOnInit(): void {
  }

}
