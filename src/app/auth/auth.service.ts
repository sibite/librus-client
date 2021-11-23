import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { MeType } from '../store/models/me.model';
import { SynergiaAccountType } from '../store/models/synergia-accounts.type';
import { StoreService } from '../store/store.service';

export type AuthStateType = {
  account: SynergiaAccountType,
  me: MeType,
  loggedIn: boolean,
  loading: boolean,
  authorized: boolean,
  error: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private unknownErrorMessage = 'Wystąpił nieznany błąd';
  public authState: AuthStateType = {
    account: null,
    me: null,
    loggedIn: false,
    loading: false,
    authorized: false,
    error: null,
  };
  public authStateSubject = new BehaviorSubject<AuthStateType>(this.authState);
  public authSuccessSubject = new Subject();

  constructor(
    private http: HttpClient
  ) {
    this.restoreAuthSession();
    this.authStateSubject.subscribe(authState => {
      this.saveLocalStorage();
    });
  }

  login(email: string, password: string) {
    this.authState.loading = true;
    this.authStateSubject.next(this.authState);

    return this.http.get(
      'https://portal.librus.pl/rodzina/login',
      {
        responseType: 'text',
        withCredentials: true
      }
    ).pipe(
      catchError(this.errorHandler.bind(this)),
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
      catchError(this.errorHandler.bind(this)),
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
        );
      }),
      catchError(this.errorHandler.bind(this)),
      tap(() => {
      this.authState = {
        ...this.authState,
        loggedIn: true,
        loading: false,
        authorized: false,
        error: null
      };
      this.authStateSubject.next(this.authState);
      })
    );
  }

  auth() {
    this.authState.loading = true;
    this.authStateSubject.next(this.authState);

    return this.http.get(
      'https://portal.librus.pl/rodzina/widget',
      {
        withCredentials: true,
        responseType: 'text'
      }
    ).pipe(
      catchError(this.errorHandler.bind(this)),
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
      catchError(this.errorHandler.bind(this)),
      switchMap(() => {
        return this.http.get(
          'https://portal.librus.pl/api/v3/SynergiaAccounts',
          {
            withCredentials: true
          }
        );
      }),
      catchError(this.errorHandler.bind(this)),
      tap(synergiaAccounts => {
        this.authState.account = synergiaAccounts.accounts[0];
        this.authStateSubject.next(this.authState);
      }),
      switchMap(synergiaAccounts => {
        return this.http.get(
          'https://api.librus.pl/2.0/Me',
          {
            withCredentials: true,
            responseType: 'json',
            headers: new HttpHeaders({
              'Authorization': 'Bearer ' + synergiaAccounts.accounts[0].accessToken
            })
          }
        );
      }),
      catchError(this.errorHandler.bind(this)),
      tap(response => {
        this.authState = {
          ...this.authState,
          me: response['Me'],
          loading: false,
          loggedIn: true,
          authorized: true,
          error: null
        };
        this.authStateSubject.next(this.authState);
        this.authSuccessSubject.next();
      })
    );
  }

  getBearerToken() {
    return this.authState.account?.accessToken || null;
  }

  saveLocalStorage() {
    localStorage.setItem('app.authState', JSON.stringify({
      ...this.authState,
      error: null,
      loading: false
    }));
  }

  restoreAuthSession() {
    console.log('restoring auth localstorage');
    this.authState = JSON.parse(localStorage.getItem('app.authState')) || this.authState;
    console.log('localStorage.app.authState', this.authState);
    this.authStateSubject.next(this.authState);
  }

  errorHandler(err) {
    const errorJSON = err?.error;
    const isJSON = String(errorJSON).startsWith('{');
    let errors = isJSON ? JSON.parse(errorJSON)?.errors : [this.unknownErrorMessage];
    let errorMessage = Object.values(errors)[0] || errors;
    return throwError(errorMessage);
  }
}

