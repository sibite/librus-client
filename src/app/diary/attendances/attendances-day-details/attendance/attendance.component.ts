import { Component, Input, OnInit } from '@angular/core';
import { AttendanceType } from 'src/app/store/models/attendance.type';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  @Input() attendance: AttendanceType;

  constructor() { }

  ngOnInit(): void {
  }

}
