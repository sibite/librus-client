import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { convertLibrusDate, formatDate } from 'src/app/shared/date-converter';
import { CapitalizePipe } from 'src/app/shared/pipes/capitalize.pipe';
import { ViewService } from 'src/app/shared/view.service';
import { AttendanceType } from 'src/app/store/models/attendance.type';
import { StoreService } from 'src/app/store/store.service';
import { getGradeDetailsHTML } from '../../grades/grade-properties';
import { formatGradeShort } from '../../grades/grades.utilities';
import { getAttendanceDetailsHTML } from '../attendance-properties';
import { attendancesByLessonSorter } from '../attendances.utilities';

@Component({
  selector: 'app-attendances-day-details',
  templateUrl: './attendances-day-details.component.html',
  styleUrls: ['./attendances-day-details.component.scss']
})
export class AttendancesDayDetailsComponent implements OnInit, OnDestroy {
  public routeTitle: string = 'Frekwencja dnia';
  public attendances: AttendanceType[] = [];
  public activatedDay: string;

  private storeSub: Subscription;

  constructor(
    public viewService: ViewService,
    private storeService: StoreService,
    private route: ActivatedRoute,
    private location: Location,
    private capitalize: CapitalizePipe
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (!params['day']) return;
      this.activatedDay = params['day'];
      if (!this.activatedDay) return;

      this.routeTitle = this.capitalize.transform(formatDate(convertLibrusDate(this.activatedDay), 'long weekday'));
    });

    this.storeSub = this.storeService.dataSyncSubject.subscribe(data => {
      if (!data?.attendanceDays) return;
      this.attendances = data.attendanceDays[this.activatedDay]
        .filter(a => a.Type.Id !== 100)
        .sort(attendancesByLessonSorter);
      console.log(this.attendances);
    });
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }


  onBack() {
    this.location.back();
  }

  showAttendanceDetails(event: MouseEvent, attendance: AttendanceType) {
    console.log(attendance);
    this.viewService.popUpSubject.next({
      title: 'Szczegóły',
      content: getAttendanceDetailsHTML(attendance)
    })
    event.stopPropagation();
  }
}
