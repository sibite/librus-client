import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { forkJoin, throwError } from "rxjs";
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
import { SchoolInfoType } from "./models/school-info.type";
import { SubjectType } from "./models/subject.type";
import { TimetableType } from "./models/timetable.type";
import { UserType } from "./models/user.type";
import { CommentType } from './models/comment.type';

@Injectable({
  providedIn: 'root'
})
export class FetcherService {

  constructor(private http: HttpClient) {}

  fetchSubjects() {
    return this.http.get(
      'https://api.librus.pl/2.0/Subjects'
    ).pipe(
      catchError(this.errorHandler.bind(this)),
      map(response => {
        return <SubjectType[]>response['Subjects'];
      }),
      map(subjects => {
        let subjectsObj: {[key: number]: SubjectType} = {};
        for (let subject of subjects) {
          subjectsObj[subject.Id] = subject;
        }
        return subjectsObj;
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
      map(users => {
        let usersObj: {[key: number]: UserType} = {};
        for (let user of users) {
          usersObj[user.Id] = user;
        }
        return usersObj;
      })
    );
  }

  fetchGrades() {
    let grades: GradeType[] = [];

    let requests = GradeKinds.map(gradeKind => {
      return this.http.get<any>(`https://api.librus.pl/2.0/${gradeKind.name}`).pipe(
          catchError(this.errorHandler.bind(this)),
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
                map(response => {
                  return response['Categories'];
                })
              );
            categoryRequests.push(req);
          }
        }
        let commentsRequests = [
          this.http.get('https://api.librus.pl/2.0/DescriptiveGrades/Comments').pipe(map(response => response['Comments'])),
          this.http.get('https://api.librus.pl/2.0/Grades/Comments').pipe(map(response => response['Comments']))
        ];
        return forkJoin([forkJoin(categoryRequests), forkJoin(commentsRequests)]);
      }),
      catchError(this.errorHandler.bind(this)),
      map(([categoryRequests, commentsRequests]) => {
        let categories: CategoryType[] = [].concat(...categoryRequests);
        let comments: CommentType[] = [].concat(...commentsRequests);
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
      catchError(this.errorHandler.bind(this)),
      tap(response => {
        let lessons: LessonType[] = response['Lessons'];
        let lessonsObj: {[key: number]: LessonType} = {};
        for (let lesson of lessons) {
          lessonsObj[lesson.Id] = lesson;
        }
        return lessonsObj;
      })
    );
  }

  fetchAttendanceTypes() {
    return this.http.get('https://api.librus.pl/2.0/Attendances/Types').pipe(
      catchError(this.errorHandler.bind(this)),
      tap(response => {
        let types: AttendanceTypeType[] = response['Types'];
        let typesObj: {[key: number]: AttendanceTypeType} = {};
        for (let type of types) {
          typesObj[type.Id] = type;
        }
        return typesObj
      })
    );
  }

  fetchAttendances() {
    return this.http.get('https://api.librus.pl/2.0/Attendances').pipe(
      catchError(this.errorHandler.bind(this)),
      tap(response => {
        let attendances: AttendanceType[] = response['Attendances'];
        return attendances;
      })
    );
  }

  fetchLuckyNumber() {
    return this.http.get('https://api.librus.pl/2.0/LuckyNumbers').pipe(
      catchError(this.errorHandler.bind(this)),
      tap(response => {
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
      catchError(this.errorHandler.bind(this)),
      tap(({schools, classes}) => {
        let schoolInfo: SchoolInfoType = schools['School'];
        let classInfo: ClassInfoType = classes['Class'];
        return { schoolInfo, classInfo };
      })
    )
  }

  fetchClassrooms() {
    return this.http.get('https://api.librus.pl/2.0/Classrooms').pipe(
      catchError(this.errorHandler.bind(this)),
      tap(response => {
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
      catchError(this.errorHandler.bind(this)),
      tap(response => {
        let timetableObj: TimetableType = response['Timetable'];
        return timetableObj;
      })
    );
  }

  fetchCalendar() {
    let requests = CalendarKinds.map(calendarKind => {
      return this.http.get<any>(`https://api.librus.pl/2.0/${calendarKind.name}`).pipe(
          catchError(this.errorHandler.bind(this)),
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
        catchError(this.errorHandler.bind(this)),
        map(response => response['Categories'])
      ),
      typesList: this.http.get('https://api.librus.pl/2.0/ClassFreeDays/Types').pipe(
        catchError(this.errorHandler.bind(this)),
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

  errorHandler(err) {
    return throwError(err);
  }
}
