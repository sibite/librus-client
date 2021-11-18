import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';
import { StoreService } from './store/store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private storeService: StoreService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.authService.authStateSubject.subscribe(state => {
      if (state.loggedIn && !state.authorized && !state.loading && !state.error) {
        console.log('Logged In but not authorized => authorizing...')
      }
      else if (state.error) {
        console.error("Error:", state.error);
      }
    });
    this.authService.authSuccessSubject.pipe(take(1)).subscribe(() => {
      console.log('Login success');
    });
    this.authService.auth();
  }

  onLogin(email: string, password: string) {
    this.authService.login(email, password);
  }

  onUrlRequest(url) {
    this.http.get(url).subscribe(response => {
      console.log(response);
    });
  }

  fetchData() {
    this.storeService.fetchSubjects().pipe(
      take(1),
      switchMap(() => {
        return this.storeService.fetchUsers();
      }),
      switchMap(() => {
        return forkJoin([
          this.storeService.fetchGrades(),
          this.storeService.fetchAttendances(true),
          this.storeService.fetchTimetable(),
          this.storeService.fetchCalendar(),
          this.storeService.fetchUnitInfo()
        ]);
      })
      ).subscribe(() => {
        console.log(this.storeService.getData());
      });
  }
}
