import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators";
import { MeType } from "./models/me.model";

export type StoreData = {
  me?: MeType,
  subjects?: {[key: string]: any}
};

@Injectable({providedIn: 'root'})
export class StoreService {
  data: StoreData = {};

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
        return response['Subjects'];
      }),
      tap(subjects => {
        this.data.subjects = subjects;
      })
    );
  }

  getData() {
    return this.data;
  }
}
