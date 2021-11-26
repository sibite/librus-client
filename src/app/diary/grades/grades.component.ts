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

  public semester = 1;
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
      this.viewService.saveScrollState(this.route, this.hostEl.nativeElement.scrollTop);
    })
  }

  ngAfterViewInit() {
    let savedScrollTop = this.viewService.getScrollState(this.route);
    this.hostEl.nativeElement.scrollTop = savedScrollTop;
  }

  onSemesterSelect(optionKey) {
    this.semester = optionKey;
  }

}
