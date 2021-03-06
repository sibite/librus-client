import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ViewService } from 'src/app/shared/view.service';
import { AttendanceType } from 'src/app/store/models/attendance.type';
import { getAttendanceDetailsHTML } from '../attendance-properties';

@Component({
  selector: 'app-attendances-day-item',
  templateUrl: './attendances-day-item.component.html',
  styleUrls: ['./attendances-day-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendancesDayItemComponent implements OnInit {
  @Input() day: string;
  @Input() attendances: AttendanceType[];

  constructor(
    private viewService: ViewService
  ) { }

  ngOnInit(): void {
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
