import { Component, OnInit } from '@angular/core';
import { toDateString, toMiddayDate } from 'src/app/shared/date-converter';
import { TimetableEntryType } from 'src/app/store/models/timetable.type';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {
  public day: string;
  public timetableDays: { [key: string]: TimetableEntryType[][] };

  constructor(
    private storeService: StoreService
  ) { }

  ngOnInit(): void {
    this.storeService.dataSyncSubject.subscribe(data => {
      if (!data.timetableDays) return;
      this.timetableDays = data.timetableDays;
      let now = new Date();
      this.day = toDateString(toMiddayDate(now));
    });
  }

}
