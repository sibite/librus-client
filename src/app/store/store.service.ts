import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { forkJoin, of, throwError } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { AttendanceTypeType } from "./models/attendance-type.type";
import { AttendanceType } from "./models/attendance.type";
import { CategoryType } from "./models/category.type";
import { GradeKindType, GradeType, GRADE_KINDS } from "./models/grade.type";
import { LessonType } from "./models/lesson.type";
import { MeType } from "./models/me.model";
import { SubjectType } from "./models/subject.model";
import { UserType } from "./models/user.type";

export type StoreData = {
  loading: boolean,
  error: string,
  me: MeType,
  subjects: {[key: number]: SubjectType},
  lessons: {[key: number]: LessonType},
  users: {[key: number]: UserType},
  categories: {[key: number]: CategoryType},
  attendances: AttendanceType[],
  attendanceTypes: {[key: number]: AttendanceTypeType},
};

@Injectable({providedIn: 'root'})
export class StoreService {
  data: StoreData = {
    loading: false,
    error: null,
    me: null,
    subjects: {},
    lessons: {},
    users: {},
    categories: {},
    attendances: [],
    attendanceTypes: {}
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
      })
    );
  }

  fetchLessons() {
    return this.http.get('https://api.librus.pl/2.0/Lessons').pipe(
      catchError(this.errorHandler.bind(this)),
      tap(response => {
        let lessons: LessonType[] = response['Lessons'];
        for (let lesson of lessons) {
          lesson.Teacher = this.data.users[lesson.Teacher.Id];
          lesson.Subject = this.data.subjects[lesson.Subject.Id];
          this.data.lessons[lesson.Id] = lesson;
        }
      })
    );
  }

  fetchTypes() {
    return this.http.get('https://api.librus.pl/2.0/Attendances/Types').pipe(
      catchError(this.errorHandler.bind(this)),
      tap(response => {
        let types: AttendanceTypeType[] = response['Types'];
        for (let type of types) {
          this.data.attendanceTypes[type.Id] = type;
        }
      })
    );
  }

  fetchAttendances(fetchLessons: boolean = false) {
    return this.fetchTypes().pipe(
      switchMap(() => {
        if (fetchLessons) {
          return this.fetchLessons()
        }
        return of(null);
      }),
      switchMap(() => {
        return this.http.get('https://api.librus.pl/2.0/Attendances').pipe(
          catchError(this.errorHandler.bind(this)),
          tap(response => {
            let attendances: AttendanceType[] = response['Attendances'];
            for (let attendance of attendances) {
              attendance.Type = this.data.attendanceTypes[attendance.Type.Id];
              attendance.AddedBy = this.data.users[attendance.AddedBy.Id];
              attendance.Lesson = this.data.lessons[attendance.Lesson.Id];
              this.data.attendances.push(attendance);
            }
          })
        );
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
