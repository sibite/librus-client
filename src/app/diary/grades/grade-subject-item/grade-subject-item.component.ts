import { Component, Input, OnInit } from '@angular/core';
import { GradeType } from 'src/app/store/models/grade.type';
import { SubjectType } from 'src/app/store/models/subject.type';
import { formatGradeShort, gradesByDateSorter } from '../grades.utilities';

@Component({
  selector: 'app-grade-subject-item',
  templateUrl: './grade-subject-item.component.html',
  styleUrls: ['./grade-subject-item.component.scss']
})
export class GradeSubjectItemComponent implements OnInit {
  @Input() subject: SubjectType;
  @Input() color: string;
  grades: GradeType[] = [];

  constructor() { }

  ngOnInit(): void {
    this.grades = this.subject.Grades.sort(gradesByDateSorter).reverse();
  }

  showGradeDetails(event: MouseEvent, grade: GradeType) {
    console.log(grade);
    event.stopPropagation();
  }

  formatGradeShort(grade: GradeType) {
    return formatGradeShort(grade);
  }

}
