import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { convertLibrusDate } from 'src/app/shared/date-utilities';
import { semesterOptions } from 'src/app/shared/semester-options';
import { ViewService } from 'src/app/shared/view.service';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss']
})
export class GradesComponent implements OnInit, AfterViewInit {
  private storeSubscription: Subscription;
  private scrollInterval;
  public gradeSubjects;
  public subjectColors;

  public semester: number;
  public semesterOptions = semesterOptions;

  constructor(
    private storeService: StoreService,
    private viewService: ViewService,
    private router: Router,
    private hostEl: ElementRef
  ) { }

  ngOnInit() {
    this.storeSubscription = this.storeService.dataSyncSubject.subscribe(
      data => {
        if (!data?.gradeSubjects || !data?.subjectColors || !data?.unitInfo) return;
        this.gradeSubjects = data.gradeSubjects?.sort((a, b) => a.Name > b.Name ? 1 : -1);
        this.subjectColors = data.subjectColors;
        let semesterChangeDate = convertLibrusDate(data.unitInfo.class.EndFirstSemester);
        this.semester = Date.now() < semesterChangeDate.getTime() + 86400e3 ? 1 : 2;
      }
    );

    this.scrollInterval = setInterval(() => {
      this.viewService.state.gradesView.scroll = this.hostEl.nativeElement.scrollTop;
    }, 250);

    this.semester = this.viewService.state.gradesView.semester ?? 0;
  }

  ngOnDestroy() {
    this.viewService.state.gradesView.semester = this.semester;
    clearInterval(this.scrollInterval);
    this.storeSubscription.unsubscribe();
  }

  onRefreshGesture() {
    if (!this.storeService.syncState.syncing) {
      this.storeService.synchronize();
    }
  }

  ngAfterViewInit() {
    let savedScrollTop = this.viewService.state.gradesView.scroll;
    this.hostEl.nativeElement.scrollTop = savedScrollTop;
  }

  onSemesterSelect(optionKey) {
    this.semester = optionKey;
  }

}
