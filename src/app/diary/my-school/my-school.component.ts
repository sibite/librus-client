import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/store/store.service';
import { getClassDetailsHTML, getSchoolDetailsHTML } from './my-school-properties';

@Component({
  selector: 'app-my-school',
  templateUrl: './my-school.component.html',
  styleUrls: ['./my-school.component.scss']
})
export class MySchoolComponent implements OnInit {
  public classDetailsHTML: string;
  public schoolDetailsHTML: string;

  constructor(
    private storeService: StoreService
  ) { }

  ngOnInit(): void {
    if (this.storeService.data?.unitInfo) {
      this.classDetailsHTML = getClassDetailsHTML(this.storeService.data.unitInfo.class);
      this.schoolDetailsHTML = getSchoolDetailsHTML(this.storeService.data.unitInfo.school);
    }
  }

}
