import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { of, throwError } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) {}

  auth(email: string, password: string) {
    this.http.get(
      'https://portal.librus.pl/rodzina/login',
      {
        responseType: 'text',
        withCredentials: true
      }
    ).pipe(
      map(responseHTML => {
        let parser = new DOMParser();
        let responseDOM = parser.parseFromString(responseHTML, 'text/html');
        let csrfToken = (<HTMLMetaElement>responseDOM.head.querySelector('meta[name="csrf-token"]')).content;
        let xsrfToken = document.cookie.match(/XSRF-TOKEN=(.*)/)[1];
        console.log(csrfToken, xsrfToken);
        if (!csrfToken || !xsrfToken) {
          throw new Error('Could not scrap tokens');
        }
        return {xsrfToken, csrfToken};
      }),
      switchMap(tokens => {
        return this.http.post(
          'https://portal.librus.pl/rodzina/login/action',
          {email, password},
          {
            headers: new HttpHeaders({
              'X-XSRF-TOKEN': tokens.xsrfToken,
              'X-CSRF-TOKEN': tokens.csrfToken,
              'X-Requested-With': 'XMLHttpRequest',
              'Accept': 'Accept: application/json, text/plain, */*',
              'Content-type': 'application/json;charset=UTF-8'
            }),
            observe: 'response',
            responseType: 'text',
            withCredentials: true
          }
        )
      }),
      catchError(err => {
        console.log(err);
        let errors = err.error?.errors;
        if (errors) {
          let errorMessage = Object.values(errors).join("<br>");
          return throwError(errorMessage);
        }
        return throwError(err);
      }),
      switchMap(response => {
        console.log(response);
        return this.http.get(
          'https://portal.librus.pl/rodzina/widget',
          {
            responseType: 'text',
            withCredentials: true
          }
        )
      }),
      switchMap((response) => {
        return this.http.get(
          'https://portal.librus.pl/oauth2/authorize',
          {
            params: new HttpParams().appendAll({
              'client_id': 'AyNzeNoSup7IkySMhBdUhSH4ucqc97Jn6DzVcqd5',
              'redirect_uri': 'https://personalschedule.librus.pl/authorize',
              'scope': 'my_data+synergia_integration',
              'state': 'zx',
              'response_type': 'code'
            }),
            withCredentials: true
          }
        )
      })
    ).subscribe(response => {
        console.log('Final response', response);
      },
      error => {
        console.log("Error:", error);
      });
  }
}

