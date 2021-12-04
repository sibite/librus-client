import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ViewService } from './shared/view.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  popUpSubscription: Subscription;
  popUpTitle: string;
  popUpContent: any;

  constructor(
    public viewService: ViewService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.popUpSubscription = this.viewService.popUpSubject.subscribe(payload => {
      this.popUpTitle = payload?.title;
      this.popUpContent = payload?.content;

      if (!payload) return;
      this.router.navigate([], {
        relativeTo: this.route,
        queryParamsHandling: 'merge',
        queryParams: { popup: 'open' }
      });

      setTimeout(() => this.router.events.pipe(take(1)).subscribe(event => {
        if (event instanceof NavigationStart && event.navigationTrigger === 'popstate') {
          this.viewService.popUpSubject.next(null);
        }
      }), 10);
    });

    // enable animations
    document.onload = () => {
      setTimeout(() => this.renderer.removeClass(document.body, 'preload'), 1000);
    }
  }

  ngOnDestroy() {
    this.popUpSubscription.unsubscribe();
  }

  onUrlRequest(url) {
    this.http.get(url).subscribe(response => {
      console.log(response);
    });
  }

  onPopUpClose() {
    this.location.back();
  }
}
