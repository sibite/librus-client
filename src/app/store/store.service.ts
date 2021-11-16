import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { catchError, map, mapTo, mergeMap, tap } from "rxjs/operators";
import { MeType } from "./models/me.model";
import { SubjectType } from "./models/subject.model";
import { UserType } from "./models/user.type";

export type StoreData = {
  loading: boolean,
  error: string,
  me?: MeType,
  subjects?: {[key: number]: SubjectType},
  users?: {[key: number]: UserType}
};

@Injectable({providedIn: 'root'})
export class StoreService {
  data: StoreData = {
    loading: false,
    error: null,
    subjects: {},
    users: {}
  };

  constructor(
    private http: HttpClient
  ) {}

  setUser(me: MeType) {
    this.data.me = me;
  }

  fetchSubjects() {
    return this.http.get(
      'https://api.librus.pl/2.0/Subjects'
    ).pipe(
      map(response => {
        return <SubjectType[]>response['Subjects'];
      }),
      tap(subjects => {
        for (let subject of subjects) {
          this.data.subjects[subject.Id] = subject;
        }
      })
    );
  }

  fetchUsers() {
    return this.http.get(
      'https://api.librus.pl/2.0/Users'
    ).pipe(
      map(response => {
        return <UserType[]>response['Users'];
      }),
      tap(users => {
        for (let user of users) {
          this.data.users[user.Id] = user;
        }
      })
    );
  }

  getData() {
    return this.data;
  }

  errorHandler() {

  }
}
