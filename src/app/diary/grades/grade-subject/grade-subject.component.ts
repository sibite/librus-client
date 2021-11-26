import { Location } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { convertLibrusDate } from 'src/app/shared/date-converter';
import { CapitalizePipe } from 'src/app/shared/pipes/capitalize.pipe';
import { semesterOptions } from 'src/app/shared/semester-options';
import { ViewService } from 'src/app/shared/view.service';
import { CategoryType } from 'src/app/store/models/category.type';
import { GradeType } from 'src/app/store/models/grade.type';
import { UserType } from 'src/app/store/models/user.type';
import { StoreService } from 'src/app/store/store.service';
import { generateGradeDetailsHTML } from '../grade-details-generator';
import { formatGradeShort, gradesByDateSorter } from '../grades.utilities';

@Component({
  selector: 'app-grade-subject',
  templateUrl: './grade-subject.component.html',
  styleUrls: ['./grade-subject.component.scss']
})
export class GradeSubjectComponent implements OnInit {
  public routeTitle: string = 'Oceny';
  public color: string;
  public semester: number;
  public semesterOptions = semesterOptions;

  public grades: GradeType[] = [];
  public users: { [key: number]: UserType };
  public categories: { [key: number]: CategoryType };

  constructor(
    public viewService: ViewService,
    private storeService: StoreService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private hostEl: ElementRef,
    private capitalize: CapitalizePipe
  ) { }

  ngOnInit(): void {
    this.users = this.storeService.data.users;
    this.categories = this.storeService.data.gradeCategories;

    this.route.params.subscribe(params => {
      if (!params['id']) return;
      const activatedSubject = this.storeService.data.gradeSubjects.find(
        subject => subject.Id == params['id']
      );

      if (!activatedSubject) return;
      this.routeTitle = this.capitalize.transform(activatedSubject.Name);

      this.grades = activatedSubject.Grades.sort(gradesByDateSorter).reverse();
      let subjectColors = this.storeService.data.subjectColors;
      this.color = subjectColors[activatedSubject.Id];
    });

    this.route.queryParams.subscribe(queryParams => {
      this.semester = Number(queryParams['semester']) || 0;
    })
  }


  onBack() {
    this.location.back();
  }

  getGrades() {
    return this.grades.filter(grade => {
      return this.semester === 0 ? true : grade.Semester === this.semester;
    })
  }

  onSemesterSelect(optionKey) {
    this.semester = optionKey;
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

  getGradeDateFormatted(grade: GradeType) {
    let localeDateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return convertLibrusDate(grade.Date).toLocaleDateString('pl-PL', <{}>localeDateOptions);
  }
}
