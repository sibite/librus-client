import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { forkJoin, of, throwError } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";

import { AttendanceTypeType } from "./models/attendance-type.type";
import { AttendanceType } from "./models/attendance.type";
import { CalendarKinds, CalendarKindType, CalendarType } from "./models/calendar.type";
import { CategoryType } from "./models/category.type";
import { ClassInfoType } from "./models/class-info.type";
import { ClassroomType } from "./models/classroom.type";
import { GradeKinds, GradeKindType, GradeType } from "./models/grade.type";
import { LessonType } from "./models/lesson.type";
import { LuckyNumberType } from "./models/lucky-number.type";
import { MeType } from "./models/me.model";
import { SchoolInfoType } from "./models/school-info.type";
import { SubjectType } from "./models/subject.type";
import { TimetableType } from "./models/timetable.type";
import { UserType } from "./models/user.type";

export type StoreData = {
  // Status
  loading: boolean,
  error: string,
  // Storage
  me: MeType,
  subjects: {[key: number]: SubjectType},
  users: {[key: number]: UserType},
  lessons: {[key: number]: LessonType},
  classrooms: {[key: number]: ClassroomType}
  categories: {[key: number]: CategoryType},
  attendances: AttendanceType[],
  attendanceTypes: {[key: number]: AttendanceTypeType},
  timetable: TimetableType,
  calendar: CalendarType,
  // Small information
  schoolInfo: SchoolInfoType,
  classInfo: ClassInfoType,
  luckyNumber: LuckyNumberType
};

@Injectable({providedIn: 'root'})
export class StoreService {
  data: StoreData = {
    // Status
    loading: false,
    error: null,
    // Storage
    me: null,
    subjects: {},
    users: {},
    lessons: {},
    classrooms: {},
    categories: {},
    attendances: [],
    attendanceTypes: {},
    timetable: {},
    calendar: {},
    // Small information
    schoolInfo: null,
    classInfo: null,
    luckyNumber: null,
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

    let requests = GradeKinds.map(gradeKind => {
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
            this.data.attendances = attendances;
          })
        );
      })
    );
  }

  fetchLuckyNumber() {
    return this.http.get('https://api.librus.pl/2.0/LuckyNumbers').pipe(
      catchError(this.errorHandler.bind(this)),
      tap(response => {
        this.data.luckyNumber = response['LuckyNumber'];
      })
    );
  }

  fetchUnitInfo() {
    return forkJoin({
      schools: this.http.get('https://api.librus.pl/2.0/Schools'),
      classes: this.http.get('https://api.librus.pl/2.0/Classes')
    }).pipe(
      catchError(this.errorHandler.bind(this)),
      tap(({schools, classes}) => {
        this.data.schoolInfo = schools['School'];
        this.data.classInfo = classes['Class'];
      })
    )
  }

  fetchClassrooms() {
    return this.http.get('https://api.librus.pl/2.0/Classrooms').pipe(
      catchError(this.errorHandler.bind(this)),
      tap(response => {
        let classrooms: ClassroomType[] = response['Classrooms'];
        for (let classroom of classrooms) {
          this.data.classrooms[classroom.Id] = classroom;
        }
      })
    );
  }

  fetchTimetable(fetchClassrooms: boolean = true, weekStart: string = '') { // YYYY-MM-DD
    return this.fetchClassrooms().pipe(
      switchMap(() => {
        return this.http.get('https://api.librus.pl/2.0/Timetables', {params: { weekStart }});
      }),
      catchError(this.errorHandler.bind(this)),
      tap(response => {
        let timetable: TimetableType = response['Timetable'];
        for (const key in timetable) {
          this.data.timetable[key] = timetable[key];
        }
      })
    );
  }

  fetchCalendar() {
    let requests = CalendarKinds.map(calendarKind => {
      return this.http.get<any>(`https://api.librus.pl/2.0/${calendarKind.name}`).pipe(
          catchError(this.errorHandler.bind),
          map(response => {
            return {
              kind: <CalendarKindType>calendarKind.propName,
              entries: response[calendarKind.propName]
            };
          })
        );
    })

    let homeworkCategories: {[key: number]: {Id: number, Name: string}} = {};
    let classFreeDayTypes: {[key: number]: {Id: number, Name: string}} = {};

    return forkJoin({
      catList: this.http.get('https://api.librus.pl/2.0/HomeWorks/Categories').pipe(
        catchError(this.errorHandler.bind),
        map(response => response['Categories'])
      ),
      typesList: this.http.get('https://api.librus.pl/2.0/ClassFreeDays/Types').pipe(
        catchError(this.errorHandler.bind),
        map(response => response['Types'])
      )
    }).pipe(
      switchMap(({catList, typesList}) => {
        for (let category of catList) {
          homeworkCategories[category.Id] = category;
        }
        for (let type of typesList) {
          classFreeDayTypes[type.Id] = type;
        }

        return forkJoin(requests);
      }),
      tap(responses => {
        let homeworks = responses.find(res => res.kind == 'HomeWorks').entries;
        let classFreeDays = responses.find(res => res.kind == 'ClassFreeDays').entries;

        for (let homework of homeworks) {
          homework.Category = homeworkCategories[homework.Category.Id];
        }
        for (let classFreeDay of classFreeDays) {
          classFreeDay.Type = classFreeDayTypes[classFreeDay.Type.Id];
        }

        for (let response of responses) {
          this.data.calendar[response.kind] = response.entries;
        }
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
