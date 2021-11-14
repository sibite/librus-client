import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { environment } from "src/environments/environment";

const corsHosts = {
  'https://portal.librus.pl/': 'portal-api',
  'https://personalschedule.librus.pl/': 'personalschedule-api',
  'https://api.librus.pl/': 'main-api'
}

export class CorsInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // check if requested URL is in CORS-allowed list
    let corsHost: string = null;
    for (let host in corsHosts) {
      if (req.url.startsWith(host)) {
        corsHost = host;
        break;
      }
    }
    // if it is not, then do nothing
    if (!corsHost) {
      console.log('Request is not in CORS-allowed list', req.url);
      return next.handle(req.clone());
    }
    // if it is, then redirect the request to proxy server
    console.log('Request is CORS-allowed', req.url);
    const corsEnabledReq = req.clone({
      url: req.url.replace(corsHost, `${environment.proxyHost}/${corsHosts[corsHost]}/`),
    })
    return next.handle(corsEnabledReq);
  }
}
