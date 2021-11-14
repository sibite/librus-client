import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit() {

  }

  onLogin(email: string, password: string) {
    this.authService.login(email, password)
      .pipe(take(1))
      .subscribe(() => {
        this.authService.auth();
      });
  }
}
