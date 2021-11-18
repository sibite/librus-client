import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const bearerToken = this.authService.getBearerToken();
    if (!req.url.startsWith('https://api.librus.pl/2.0') || !bearerToken) {
      return next.handle(req);
    }
    const authorizedReq = req.clone({
      setHeaders: { Authorization: 'Bearer ' + bearerToken}
    });
    return next.handle(authorizedReq);
  }
}
