import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap, take } from 'rxjs/operators';
import { ViewService } from '../shared/view.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  errorMessage = null;
  isLoading = false;
  isSidemenuOpened = false;

  constructor(
    public viewService: ViewService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      this.authService.login(form.value['email'], form.value['password'])
        .pipe(
          take(1),
          switchMap(() => {
            return this.authService.auth();
          })
        )
        .subscribe(
          response => {
            console.log(response);
            this.isLoading = false;
            this.router.navigate(['/diary']);
          },
          error => {
            this.errorMessage = error;
            this.isLoading = false;
          })
    }
  }

  onCloseSidemenu() {
    this.isSidemenuOpened = false;
  }

  onOpenSidemenu() {
    this.isSidemenuOpened = true;
  }

}
