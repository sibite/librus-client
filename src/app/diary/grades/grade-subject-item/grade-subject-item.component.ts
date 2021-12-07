import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ViewService } from 'src/app/shared/view.service';
import { GradeType } from 'src/app/store/models/grade.type';
import { SubjectType } from 'src/app/store/models/subject.type';
import { getGradeDetailsHTML } from '../grade-properties';
import { formatGradeShort, gradesByDateSorter } from '../grades.utilities';

@Component({
  selector: 'app-grade-subject-item',
  templateUrl: './grade-subject-item.component.html',
  styleUrls: ['./grade-subject-item.component.scss']
})
export class GradeSubjectItemComponent implements OnInit {
  @ViewChild('popupContent') popupContentRef: ElementRef;
  @Input() subject: SubjectType;
  @Input() semester: number;
  @Input() color: string;
  grades: GradeType[] = [];

  constructor(
    private viewService: ViewService
  ) { }

  ngOnInit(): void {
    this.grades = this.subject.Grades.sort(gradesByDateSorter);
  }

  showGradeDetails(event: MouseEvent, grade: GradeType) {
    console.log(grade);
    this.viewService.popUpSubject.next({
      title: 'Szczegóły',
      content: getGradeDetailsHTML(grade)
    })
    event.stopPropagation();
  }

  formatGradeShort(grade: GradeType) {
    return formatGradeShort(grade);
  }

  getGrades() {
    return this.grades.filter(grade => {
      return this.semester === 0 ? true : grade.Semester === this.semester;
    })
  }

  getAverage() {
    let constituentGrades = this.getGrades().filter(grade => grade.IsConstituent);
    let weightSum = constituentGrades.reduce((sum: number, nextGrade) => {
      let weight = nextGrade.Category.Weight
      return nextGrade.Grade.match(/\d|nb/) ? sum + weight : sum;
    }, 0);
    let gradesSum = constituentGrades.reduce((sum: number, nextGrade) => {
      const orgGrade = nextGrade.Grade;
      let grade: number;
      if (orgGrade.match(/\d\+/)) {
        grade = +orgGrade.substr(0, 1) + 0.5;
      }
      else if (orgGrade.match(/\d\-/)) {
        grade = +orgGrade.substr(0, 1) - 0.25;
      }
      else if (orgGrade === 'nb' || orgGrade === '0') {
        grade = 1;
      }
      else if (Number(orgGrade)) {
        grade = +orgGrade;
      }
      else {
        grade = 0;
      }
      return sum + grade * nextGrade.Category.Weight;
    }, 0);

    return Math.round(gradesSum / weightSum * 100) / 100 || null;
  }

}
