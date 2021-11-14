import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { of, throwError } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { SynergiaAccountsType } from './data-storage/models/synergia-accounts.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) {}

  login(email: string, password: string) {
    return this.http.get(
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
        let errorJSON = err?.error;
        let errors = errorJSON ? JSON.parse(errorJSON)?.errors : ['Wystąpił nieznany błąd'];
        if (errors) {
          let errorMessage = Object.values(errors).join("<br>");
          return throwError(errorMessage);
        }
        return throwError(err);
      })
    );
  }

  auth() {
    return this.http.get(
      'https://portal.librus.pl/rodzina/widget',
      {
        responseType: 'text',
        withCredentials: true
      }
    ).pipe(
      switchMap(() => {
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
        );
      }),
      switchMap(() => {
        return this.http.get<SynergiaAccountsType>(
          'https://portal.librus.pl/api/v3/SynergiaAccounts',
          {
            withCredentials: true
          }
        );
      }),
      catchError(err => {
        let errorJSON = err?.error;
        let errors = errorJSON ? JSON.parse(errorJSON)?.errors : ['Wystąpił nieznany błąd'];
        if (errors) {
          let errorMessage = Object.values(errors).join("<br>");
          return throwError(errorMessage);
        }
        return throwError(err);
      })
    )
    .subscribe((response: SynergiaAccountsType) => {
        console.log('Token:', response.accounts[0].accessToken);
        console.log('User name:', response.accounts[0].studentName);
      },
      error => {
        console.log("Error:", error);
      }
    );
  }
}

