import { Component, Input, OnInit } from '@angular/core';
import { GradeType } from 'src/app/store/models/grade.type';
import { formatGradeShort } from '../../grades.utilities';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss']
})
export class GradeComponent implements OnInit {
  @Input() grade: GradeType;

  constructor() { }

  ngOnInit(): void {
  }

  formatGradeShort(grade: GradeType) {
    return formatGradeShort(grade);
  }
}
