import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { ViewService } from './shared/view.service';
import { FetcherService } from './store/fetcher.service';

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
    private authService: AuthService,
    public viewService: ViewService,
    private http: HttpClient,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.popUpSubscription = this.viewService.popUpSubject.subscribe(payload => {
      this.popUpTitle = payload?.title;
      this.popUpContent = payload?.content;
    });

    this.router.events.subscribe(() => {
      this.viewService.popUpSubject.next(null);
    });

    this.renderer.removeClass(document.body, 'preload');
  }

  ngOnDestroy() {
    this.popUpSubscription.unsubscribe();
  }

  onLogin(email: string, password: string) {
    this.authService.login(email, password);
  }

  onUrlRequest(url) {
    this.http.get(url).subscribe(response => {
      console.log(response);
    });
  }

  onPopUpClose() {
    this.viewService.popUpSubject.next({ content: null, title: null});
  }
}
