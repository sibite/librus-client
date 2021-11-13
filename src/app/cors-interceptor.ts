import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";

const allowedHosts = [
  'https://portal.librus.pl/'
]

export class CorsInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let reqHost: string;
    for (let host of allowedHosts) {
      if (!req.url.startsWith(host)) {
        console.log('Request is not matching allowedHosts')
        return next.handle(req.clone());
      }
      reqHost = host;
    }
    const corsEnabledReq = req.clone({
      url: req.url.replace(reqHost, 'http://localhost:3000/portal-api/'),
    })
    console.log('Request is matching', corsEnabledReq);
    return next.handle(corsEnabledReq);
  }
}
