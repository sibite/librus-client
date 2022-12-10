import { Component, Input, OnInit } from '@angular/core';
import { GradeType } from 'src/app/store/models/grade.type';
import { formatGradeShort } from '../../grades.utilities';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss']
})
export class GradeComponent implements OnInit {
  @Input() grade: Partial<GradeType>;
  @Input() showSubject: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  formatGradeShort(grade: Partial<GradeType>) {
    return formatGradeShort(grade);
  }
}
