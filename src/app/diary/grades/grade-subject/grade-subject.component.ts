import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CapitalizePipe } from 'src/app/shared/capitalize.pipe';
import { convertLibrusDate } from 'src/app/shared/date-converter';
import { ViewService } from 'src/app/shared/view.service';
import { CategoryType } from 'src/app/store/models/category.type';
import { GradeType } from 'src/app/store/models/grade.type';
import { UserType } from 'src/app/store/models/user.type';
import { StoreService } from 'src/app/store/store.service';
import { formatGradeShort, gradesByDateSorter } from '../grades.utilities';

@Component({
  selector: 'app-grade-subject',
  templateUrl: './grade-subject.component.html',
  styleUrls: ['./grade-subject.component.scss']
})
export class GradeSubjectComponent implements OnInit {
  public routeTitle: string = 'Oceny';
  public color: string;
  public grades: GradeType[] = [];
  public users: { [key: number]: UserType };
  public categories: { [key: number]: CategoryType };

  constructor(
    public viewService: ViewService,
    private storeService: StoreService,
    private route: ActivatedRoute,
    private location: Location,
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
  }

  onBack() {
    this.location.back();
  }

  showGradeDetails(event: MouseEvent, grade: GradeType) {
    console.log(grade);
    event.stopPropagation();
  }

  formatGradeShort(grade: GradeType) {
    return formatGradeShort(grade);
  }

  getGradeDate(grade: GradeType) {
    return convertLibrusDate(grade.Date);
  }
}
