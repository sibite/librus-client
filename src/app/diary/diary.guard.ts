import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class DiaryGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.authState?.loggedIn) return true;
    return this.router.createUrlTree(['/auth'])
  }
}
