import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { forkJoin, throwError } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { CategoryType } from "./models/category.type";
import { GradeKindType, GradeType, GRADE_KINDS } from "./models/grade.type";
import { MeType } from "./models/me.model";
import { SubjectType } from "./models/subject.model";
import { UserType } from "./models/user.type";

export type StoreData = {
  loading: boolean,
  error: string,
  me: MeType,
  subjects: {[key: number]: SubjectType},
  users: {[key: number]: UserType},
  categories: {[key: number]: any}
};

@Injectable({providedIn: 'root'})
export class StoreService {
  data: StoreData = {
    loading: false,
    error: null,
    me: null,
    subjects: {},
    users: {},
    categories: {}
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
      catchError(this.errorHandler.bind(this)),
      map(response => {
        return <SubjectType[]>response['Subjects'];
      }),
      tap(subjects => {
        for (let subject of subjects) {
          subject.Grades = [];
          this.data.subjects[subject.Id] = subject;
        }
      })
    );
  }

  fetchUsers() {
    return this.http.get(
      'https://api.librus.pl/2.0/Users'
    ).pipe(
      catchError(this.errorHandler.bind(this)),
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

  fetchGrades() {
    let grades: GradeType[] = [];

    let requests = GRADE_KINDS.map(gradeKind => {
      return this.http.get<any>(`https://api.librus.pl/2.0/${gradeKind.name}`).pipe(
          catchError(this.errorHandler.bind),
          map(response => {
            return {
              kind: <GradeKindType>gradeKind.name,
              grades: <GradeType[]>response[gradeKind.propName]
            };
          })
        );
    })

    return forkJoin(requests).pipe(
      switchMap(responses => {
        let categoryRequests = [];
        for (let response of responses) {
          grades = grades.concat(<GradeType[]>response.grades);
          let categoryIds = new Set();
          // Iterating through all grades in group to get all used Categories
          for (let grade of response.grades) {
            categoryIds.add(grade.Category.Id);
            grade.Kind = response.kind;
          }
          let categoryIdsArr = Array.from(categoryIds.values());
          if (categoryIdsArr.length > 0) {
            let req = this.http.get(`https://api.librus.pl/2.0/${response.kind}/Categories/${categoryIdsArr.join(',')}`)
              .pipe(
                catchError(this.errorHandler.bind),
                map(response => {
                  return response['Categories'];
                })
              );
            categoryRequests.push(req);
          }
        }
        return forkJoin(categoryRequests);
      }),
      tap(categoryGroups => {
        let categories: CategoryType[] = [].concat(...categoryGroups);
        // Saving categories
        for (let category of categories) {
          this.data.categories[category.Id] = category;
        }
        // Assigning category objects to grades
        for (let grade of grades) {
          grade.AddedBy = this.data.users[grade.AddedBy.Id];
          grade.Category = this.data.categories[grade.Category.Id];
          this.data.subjects[grade.Subject.Id].Grades.push(grade);
        }
        console.log(this.getData())
      })
    );
  }

  getData() {
    return this.data;
  }

  errorHandler(err) {
    return throwError(err);
  }
}
