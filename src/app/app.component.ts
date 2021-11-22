import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { FetcherService } from './store/fetcher.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private fetcherService: FetcherService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // this.authService.auth().pipe(take(1)).subscribe();
  }

  onLogin(email: string, password: string) {
    this.authService.login(email, password);
  }

  onUrlRequest(url) {
    this.http.get(url).subscribe(response => {
      console.log(response);
    });
  }
}
