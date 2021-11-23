import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StoreDataType, StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss']
})
export class GradesComponent implements OnInit, OnDestroy {
  private storeSubscription: Subscription;
  public gradeSubjects;
  public subjectColors;

  constructor(
    private storeService: StoreService
  ) { }

  ngOnInit(): void {
    this.storeSubscription = this.storeService.dataSyncSubject.subscribe(
      data => {
        this.gradeSubjects = data.gradeSubjects.sort((a, b) => a.Name > b.Name ? 1 : -1);
        this.subjectColors = data.subjectColors;
      }
    );
  }

  ngOnDestroy() {
    this.storeSubscription.unsubscribe();
  }

}
