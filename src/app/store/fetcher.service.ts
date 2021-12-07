import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { forkJoin, of, throwError } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { AttendanceTypeType } from "./models/attendance-type.type";
import { AttendanceType } from "./models/attendance.type";
import { CalendarKinds, CalendarKindType, CalendarType } from "./models/calendar.type";
import { CategoriesType } from "./models/category.type";
import { ClassInfoType } from "./models/class-info.type";
import { ClassroomType } from "./models/classroom.type";
import { CommentType } from './models/comment.type';
import { GradeKinds, GradeKindType, GradeType } from "./models/grade.type";
import { LessonType } from "./models/lesson.type";
import { LuckyNumberType } from "./models/lucky-number.type";
import { SchoolInfoType } from "./models/school-info.type";
import { SubjectType } from "./models/subject.type";
import { TimetableType } from "./models/timetable.type";
import { UserType } from "./models/user.type";
import { getIdAsKeysObj } from './transform-utilities';


export type FetcherDataType = {
  // Storage
  subjects?: { [key: number]: SubjectType },
  themes?: any[],
  grades?: {
    categories: CategoriesType,
    comments: CommentType[],
    list: GradeType[],
  },
  users?: { [key: number]: UserType },
  lessons?: { [key: number]: LessonType },
  classrooms?: { [key: number]: ClassroomType },
  attendances?: AttendanceType[],
  attendanceTypes?: { [key: number]: AttendanceTypeType },
  timetable?: TimetableType,
  calendar?: CalendarType,
  // Small information
  unitInfo?: {
    school: SchoolInfoType,
    class: ClassInfoType
  }
  luckyNumber?: LuckyNumberType
}

@Injectable({
  providedIn: 'root'
})
export class FetcherService {

  constructor(private http: HttpClient) {}

  fetchSubjects() {
    return this.http.get(
      'https://api.librus.pl/2.0/Subjects'
    ).pipe(
      catchError(err => {
        return this.errorHandler(err, { Subjects: [] });
      }),
      map(response => {
        return <SubjectType[]>response['Subjects'];
      }),
      map(subjects => {
        return getIdAsKeysObj(subjects);
      })
    );
  }

  fetchUsers() {
    return this.http.get(
      'https://api.librus.pl/2.0/Users'
    ).pipe(
      catchError(err => {
        return this.errorHandler(err, { Users: [] });
      }),
      map(response => {
        return <UserType[]>response['Users'];
      }),
      map(users => {
        return getIdAsKeysObj(users)
      })
    );
  }

  fetchGrades() {
    let grades: GradeType[] = [];

    let requests = GradeKinds.map(gradeKind => {
      return this.http.get<any>(`https://api.librus.pl/2.0/${gradeKind.name}`).pipe(
          catchError(err => {
            return this.errorHandler(err, { [gradeKind.propName]: [] });
          }),
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
        let categoryRequests = {};
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
                map(response => {
                  return response['Categories'];
                })
              );
            categoryRequests[response.kind] = req;
          }
        }
        let commentsRequests = {
          'DescriptiveGrades': this.http.get('https://api.librus.pl/2.0/DescriptiveGrades/Comments').pipe(map(response => response['Comments'] ?? [])),
          'Grades': this.http.get('https://api.librus.pl/2.0/Grades/Comments').pipe(map(response => response['Comments'] ?? []))
        };
        return forkJoin([forkJoin(categoryRequests), forkJoin(commentsRequests)]);
      }),
      catchError(err => {
        return this.errorHandler(err, [ {}, {} ]);
      }),
      map(([categoryRequests, commentsRequests]) => {
        let categories = {};
        let comments = {};
        for (let categoryKind of Object.keys(categoryRequests)) {
          categories[categoryKind] = getIdAsKeysObj(categoryRequests[categoryKind]);
        }
        for (let commentKind of Object.keys(commentsRequests)) {
          comments[commentKind] = getIdAsKeysObj(commentsRequests[commentKind]);
        }
        // Returning grades
        return {
          categories: categories,
          comments: comments,
          list: grades
        };
      })
    );
  }

  fetchLessons() {
    return this.http.get('https://api.librus.pl/2.0/Lessons').pipe(
      catchError(err => {
        return this.errorHandler(err, { Lessons: [] });
      }),
      map(response => {
        let lessons: LessonType[] = response['Lessons'];
        return getIdAsKeysObj(lessons);
      })
    );
  }

  fetchAttendanceTypes() {
    return this.http.get('https://api.librus.pl/2.0/Attendances/Types').pipe(
      catchError(err => {
        return this.errorHandler(err, { Types: [] });
      }),
      map(response => {
        let types: AttendanceTypeType[] = response['Types'];
        return getIdAsKeysObj(types);
      })
    );
  }

  fetchAttendances() {
    return this.http.get('https://api.librus.pl/2.0/Attendances').pipe(
      catchError(err => {
        return this.errorHandler(err, { Attendances: [] });
      }),
      map(response => {
        let attendances: AttendanceType[] = response['Attendances'];
        return attendances;
      })
    );
  }

  fetchLuckyNumber() {
    return this.http.get('https://api.librus.pl/2.0/LuckyNumbers').pipe(
      catchError(err => {
        return this.errorHandler(err, { LuckyNumber: { } });
      }),
      map(response => {
        let luckyNumber: LuckyNumberType = response['LuckyNumber'];
        return luckyNumber;
      })
    );
  }

  fetchUnitInfo() {
    return forkJoin({
      schools: this.http.get('https://api.librus.pl/2.0/Schools'),
      classes: this.http.get('https://api.librus.pl/2.0/Classes')
    }).pipe(
      catchError(err => {
        return this.errorHandler(err, { schools: {School: {}}, classes: {Class:{}} });
      }),
      map(({schools, classes}) => {
        let school: SchoolInfoType = schools['School'];
        let class_: ClassInfoType = classes['Class'];
        return { school, class: class_ };
      })
    )
  }

  fetchClassrooms() {
    return this.http.get('https://api.librus.pl/2.0/Classrooms').pipe(
      catchError(err => {
        return this.errorHandler(err, { Classrooms: [] });
      }),
      map(response => {
        let classrooms: ClassroomType[] = response['Classrooms'];
        let classroomsObj: {[key: number]: ClassroomType} = {};
        for (let classroom of classrooms) {
          classroomsObj[classroom.Id] = classroom;
        }
        return classroomsObj;
      })
    );
  }

  fetchTimetable(weekStart: string = '') { // YYYY-MM-DD
    return this.fetchClassrooms().pipe(
      switchMap(() => {
        return this.http.get('https://api.librus.pl/2.0/Timetables', {params: { weekStart }});
      }),
      catchError(err => {
        return this.errorHandler(err, false);
      }),
      map(response => {
        let timetableObj: TimetableType = response['Timetable'];
        return timetableObj;
      })
    );
  }

  fetchCalendar() {
    let requests = CalendarKinds.map(calendarKind => {
      return this.http.get<any>(`https://api.librus.pl/2.0/${calendarKind.name}`).pipe(
        catchError(err => {
          return this.errorHandler(err, { [calendarKind.propName]: [] });
        }),
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
        map(response => response['Categories'] ?? [])
      ),
      typesList: this.http.get('https://api.librus.pl/2.0/ClassFreeDays/Types').pipe(
        map(response => response['Types'] ?? [])
      )
    }).pipe(
      switchMap(({catList, typesList}) => {
        homeworkCategories = getIdAsKeysObj(catList);
        classFreeDayTypes = getIdAsKeysObj(typesList);

        return forkJoin(requests);
      }),
      map(responses => {
        let homeworks = responses.find(res => res.kind == 'HomeWorks').entries;
        let classFreeDays = responses.find(res => res.kind == 'ClassFreeDays').entries;
        let calendarObj: CalendarType = {};

        for (let homework of homeworks) {
          homework.Category = homeworkCategories[homework.Category.Id];
        }
        for (let classFreeDay of classFreeDays) {
          classFreeDay.Type = classFreeDayTypes[classFreeDay.Type.Id];
        }
        for (let response of responses) {
          calendarObj[response.kind] = response.entries;
        }
        return calendarObj
      })
    );
  }

  fetchThemes() {
    return this.http.get('https://portal.librus.pl/api/v3/Themes', { withCredentials: true });
  }

  errorHandler(err, placeholder = null) {
    console.error(err);
    if (err.error?.Code == "TokenIsExpired") {
      console.log(err.error?.Code);
      return throwError(err);
    }
    else {
      return of(placeholder);
    }
  }
}
