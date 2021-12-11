import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ChildActivationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SideMenuComponent } from '../shared/side-menu/side-menu.component';
import { ViewService } from '../shared/view.service';
import { StoreService } from '../store/store.service';
import { diaryAnimations } from './diary.animations';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss'],
  animations: diaryAnimations
})
export class DiaryComponent implements OnInit {
  @ViewChild(SideMenuComponent, {read: ElementRef, static: true}) sidemenuElRef: ElementRef;

  isSidemenuOpened = false;
  routeTitle: string = "Dziennik";

  constructor(
    public viewService: ViewService,
    public storeService: StoreService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setTitle();
    this.router.events.pipe(
      filter(e => e instanceof ChildActivationEnd)
    ).subscribe(this.setTitle.bind(this));
  }

  setTitle() {
    let route = this.route.firstChild;
    this.routeTitle = route.snapshot.data.title || "Dziennik";
  }

  onCloseSidemenu() {
    this.isSidemenuOpened = false;
  }

  onOpenSidemenu() {
    this.isSidemenuOpened = true;
  }

  getRouteAnimation(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.animation;
  }

}
