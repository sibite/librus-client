import { Component, OnInit } from '@angular/core';
import { take, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
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

  }

  onLogin(email: string, password: string) {
    this.authService.login(email, password)
      .pipe(
        take(1),
        switchMap(() => {
          return this.authService.auth();
        })
      )
      .subscribe(() => {
        console.log('Login success');
        console.log(this.storeService.getData());
      },
      error => {
        console.error("Error:", error);
      }
    );
  }
}
