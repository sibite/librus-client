import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ViewService } from 'src/app/shared/view.service';
import { GradeType } from 'src/app/store/models/grade.type';
import { SubjectType } from 'src/app/store/models/subject.type';
import { generateGradeDetailsHTML } from '../grade-details-generator';
import { formatGradeShort, gradesByDateSorter } from '../grades.utilities';

@Component({
  selector: 'app-grade-subject-item',
  templateUrl: './grade-subject-item.component.html',
  styleUrls: ['./grade-subject-item.component.scss']
})
export class GradeSubjectItemComponent implements OnInit {
  @ViewChild('popupContent') popupContentRef: ElementRef;
  @Input() subject: SubjectType;
  @Input() color: string;
  grades: GradeType[] = [];

  constructor(
    private viewService: ViewService
  ) { }

  ngOnInit(): void {
    this.grades = this.subject.Grades.sort(gradesByDateSorter).reverse();
  }

  showGradeDetails(event: MouseEvent, grade: GradeType) {
    console.log(grade);
    this.viewService.popUpSubject.next({
      title: 'Szczegóły',
      content: generateGradeDetailsHTML(grade)
    })
    event.stopPropagation();
  }

  formatGradeShort(grade: GradeType) {
    return formatGradeShort(grade);
  }

}
