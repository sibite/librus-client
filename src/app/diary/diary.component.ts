import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewService } from '../shared/view.service';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { StoreService } from '../store/store.service';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss']
})
export class DiaryComponent implements OnInit {
  isSidemenuOpened = false;
  routeTitle: string = "Dziennik";
  @ViewChild(SideMenuComponent, {read: ElementRef, static: true}) sidemenuElRef: ElementRef;

  constructor(
    public viewService: ViewService,
    public storeService: StoreService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const route = this.route.firstChild ?? this.route;
    route.data.subscribe(data => {
      this.routeTitle = data.title || "Dziennik";
    });

    route.params.subscribe(params => {
      if (params['id']) {
        const id = params['id'];
        const activatedSubject = this.storeService.data.gradeSubjects[id];
        let name = activatedSubject.Name;
        this.routeTitle = name.substr(0, 1).toUpperCase() + name.substr(1);
      }
    })
  }

  onCloseSidemenu() {
    this.isSidemenuOpened = false;
  }

  onOpenSidemenu() {
    this.isSidemenuOpened = true;
  }

}
