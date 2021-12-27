import { ChangeDetectionStrategy, Component, ElementRef, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { convertLibrusDate, formatDate } from 'src/app/shared/date-utilities';
import { ViewService } from 'src/app/shared/view.service';
import { AttendanceType } from 'src/app/store/models/attendance.type';
import { StoreService } from 'src/app/store/store.service';
import { attendancesByLessonSorter } from './attendances.utilities';

@Component({
  selector: 'app-attendances',
  templateUrl: './attendances.component.html',
  styleUrls: ['./attendances.component.scss']
})
export class AttendancesComponent implements OnInit {
  private storeSubscription: Subscription;
  private scrollInterval;
  public attendances: { [key: string]: AttendanceType[] };
  public attendanceDates: string[];
  public attendanceDatesFormatted: { [key: string]: string } = {};
  public subjectColors;

  constructor(
    private storeService: StoreService,
    private viewService: ViewService,
    private hostEl: ElementRef
  ) { }

  ngOnInit() {
    this.storeSubscription = this.storeService.dataSyncSubject.subscribe(
      data => {
        this.attendances = { ...data.attendanceDays };
        console.log(this.viewService.showPresent);
        Object.entries(this.attendances)
          .forEach(([key, day]) => {
            this.attendances[key] = day.filter(a => a.Type.Id !== 100 || this.viewService.showPresent)
              .sort(attendancesByLessonSorter);
          });
        if (!this.attendances) return;
        this.attendanceDates = Object.keys(this.attendances).reverse();
        for (let attendanceDate of this.attendanceDates) {
          let formattedDate = formatDate(convertLibrusDate(attendanceDate), 'long weekday');
          this.attendanceDatesFormatted[attendanceDate] = formattedDate;
        }
        this.subjectColors = data.subjectColors;
      }
    );

    this.scrollInterval = setInterval(() => {
      this.viewService.state.attendancesView.scroll = this.hostEl.nativeElement.scrollTop;
    }, 250);
  }

  ngOnDestroy() {
    this.storeSubscription.unsubscribe();
    clearInterval(this.scrollInterval);
  }

  onRefreshGesture() {
    if (!this.storeService.syncState.syncing) {
      this.storeService.synchronize();
    }
  }

  ngAfterViewInit() {
    let savedScrollTop = this.viewService.state.attendancesView.scroll;
    this.hostEl.nativeElement.scrollTop = savedScrollTop;
  }

  isDisplayed(attendances: AttendanceType[]) {
    return attendances.find(a => a.Type.Id !== 100 || this.viewService.showPresent);
  }

}
