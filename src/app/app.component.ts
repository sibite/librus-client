import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
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
    private storeService: StoreService
  ) {}

  ngOnInit() {
    this.authService.authStateSubject.subscribe(state => {
      if (state.authorized) {
        console.log('Login success');
        console.log(this.storeService.getData());
        this.onSubjectsFetch();
      }
      else if (state.loggedIn && !state.authorized && !state.loading) {
        console.log('Logged In but not authorized => authorizing...')
        this.authService.auth();
      }
      else if (state.error) {
        console.error("Error:", state.error);
      }
    });
  }

  onLogin(email: string, password: string) {
    this.authService.login(email, password);
  }

  onSubjectsFetch() {
    this.storeService.fetchSubjects()
      .subscribe(
        subjects => {
          console.log(subjects);
        }
      )
  }
}
