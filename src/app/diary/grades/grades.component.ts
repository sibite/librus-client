import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { semesterOptions } from 'src/app/shared/semester-options';
import { ViewService } from 'src/app/shared/view.service';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss']
})
export class GradesComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollable') scrollable: ElementRef;

  private storeSubscription: Subscription;
  public gradeSubjects;
  public subjectColors;

  public semester: number;
  public semesterOptions = semesterOptions;

  constructor(
    private storeService: StoreService,
    private viewService: ViewService,
    private hostEl: ElementRef,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.storeSubscription = this.storeService.dataSyncSubject.subscribe(
      data => {
        this.gradeSubjects = data.gradeSubjects?.sort((a, b) => a.Name > b.Name ? 1 : -1);
        this.subjectColors = data.subjectColors;
      }
    );

    this.hostEl.nativeElement.addEventListener('scroll', () => {
      this.viewService.state.gradesView.scroll = this.hostEl.nativeElement.scrollTop;
    })

    this.semester = this.viewService.state.gradesView.semester ?? 1;
  }

  ngOnDestroy() {
    this.viewService.state.gradesView.semester = this.semester;
  }

  ngAfterViewInit() {
    let savedScrollTop = this.viewService.state.gradesView.scroll;
    this.hostEl.nativeElement.scrollTop = savedScrollTop;
    console.log(this.semester);
  }

  onSemesterSelect(optionKey) {
    this.semester = optionKey;
  }

}
