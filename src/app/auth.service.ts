import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { MeType } from './store/models/me.model';
import { SynergiaAccountType } from './store/models/synergia-accounts.model';
import { StoreService } from './store/store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private unknownErrorMessage = 'Wystąpił nieznany błąd';

  constructor(
    private http: HttpClient,
    private storeService: StoreService
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
        ).pipe(catchError(this.errorHandler.bind(this)));
      })
    );
  }

  auth() {
    let account: SynergiaAccountType;
    let me: MeType;

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
        return this.http.get(
          'https://portal.librus.pl/api/v3/SynergiaAccounts',
          {
            withCredentials: true
          }
        ).pipe(catchError(this.errorHandler.bind(this)));
      }),
      tap(synergiaAccounts => {
        account = synergiaAccounts.accounts[0];
      }),
      switchMap(synergiaAccounts => {
        console.log(synergiaAccounts);
        return this.http.get(
          'https://api.librus.pl/2.0/Me',
          {
            withCredentials: true,
            headers: new HttpHeaders({
              'Authorization': 'Bearer ' + synergiaAccounts.accounts[0].accessToken
            })
          }
        ).pipe(catchError(this.errorHandler.bind(this)));
      }),
      tap(response => {
        me = response.Me;
        this.storeService.setUser({account, me});
      })
    );
  }

  errorHandler(err) {
    let errorJSON = err?.error;
    let errors = errorJSON ? JSON.parse(errorJSON)?.errors : [this.unknownErrorMessage];
    if (errors) {
      let errorMessage = Object.values(errors)[0] || errors;
      return throwError(errorMessage);
    }
    return throwError(err);
  }
}

