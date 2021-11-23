import { Injectable } from "@angular/core";
import { BehaviorSubject, forkJoin, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { FetcherService } from "./fetcher.service";
import { AttendanceTypeType } from "./models/attendance-type.type";
import { AttendanceType } from "./models/attendance.type";
import { CalendarType } from "./models/calendar.type";
import { CategoryType } from "./models/category.type";
import { ClassInfoType } from "./models/class-info.type";
import { ClassroomType } from "./models/classroom.type";
import { GradeType } from "./models/grade.type";
import { LessonType } from "./models/lesson.type";
import { LuckyNumberType } from "./models/lucky-number.type";
import { SchoolInfoType } from "./models/school-info.type";
import { SubjectType } from "./models/subject.type";
import { TimetableType } from "./models/timetable.type";
import { UserType } from "./models/user.type";


export type FetcherDataType = {
  // Storage
  subjects?: { [key: number]: SubjectType },
  themes?: any[],
  grades?: {
    categories: { [key: number]: CategoryType };
    list: GradeType[];
  },
  users?: { [key: number]: UserType },
  lessons?: { [key: number]: LessonType },
  classrooms?: { [key: number]: ClassroomType },
  attendances?: AttendanceType[],
  attendanceTypes?: { [key: number]: AttendanceTypeType },
  timetable?: TimetableType,
  calendar?: CalendarType,
  // Small information
  schoolInfo?: SchoolInfoType,
  classInfo?: ClassInfoType,
  luckyNumber?: LuckyNumberType
}

export type StoreDataType = {
  lastSyncTime?: number,
  gradeSubjects?: SubjectType[],
  gradeCategories?: { [key: number]: CategoryType },
  subjectColors?: { [key: number]: string },
  users?: { [key: number]: UserType },
};

@Injectable({ providedIn: 'root' })
export class StoreService {
  fetcherData: FetcherDataType = {};
  data: StoreDataType = {};
  dataSyncSubject = new BehaviorSubject<StoreDataType>({});

  constructor(
    private fetcherService: FetcherService,
    private authService: AuthService
  ) {
    this.restoreLocalStorage();
    this.dataSyncSubject.next(this.data);
    const lastSyncTime = this.data.lastSyncTime || 0;
    // sync if last synced minimum 30 minutes ago
    if (Date.now() - lastSyncTime > 1800 * 1000) {
      this.synchronize();
    }
    else {
      setTimeout(() => this.synchronize(), lastSyncTime + 1800 * 1000 - Date.now());
    }
  }

  synchronize(isSecondAttempt = false) {
    const queueMap = {
      subjects: this.fetcherService.fetchSubjects(),
      users: this.fetcherService.fetchUsers(),
      grades: this.fetcherService.fetchGrades(),
      attendanceTypes: this.fetcherService.fetchAttendanceTypes(),
      attendances: this.fetcherService.fetchAttendances(),
      classrooms: this.fetcherService.fetchClassrooms(),
      timetable: this.fetcherService.fetchTimetable(),
      calendar: this.fetcherService.fetchCalendar(),
      unitInfo: this.fetcherService.fetchUnitInfo(),
      themes: this.fetcherService.fetchThemes()
    };

    forkJoin(queueMap)
      .pipe(
        catchError(err => {
          return this.syncErrorHandler(err, isSecondAttempt);
        })
      )
      .subscribe(forkResponse => {
        this.fetcherData = forkResponse;
        this.transformFetcherData();
        // emit sync subject
        this.dataSyncSubject.next(this.data);
        this.data.lastSyncTime = Date.now();
        // resync after 30 minutes
        setTimeout(() => this.synchronize(), 1800 * 1000);
        this.saveLocalStorage();
        console.log(this.getData());
      });
  }

  transformFetcherData() {
    // transform functions (tidying messy api responses)

    let transformGrades = () => {
      let gradesSubjects = { ...this.fetcherData.subjects };
      for (let subject of Object.values(gradesSubjects)) {
        subject.Grades = [];
      }
      for (let grade of this.fetcherData.grades.list) {
        gradesSubjects[grade.Subject.Id].Grades.push(grade);
      }
      this.data.gradeSubjects = Object.values(gradesSubjects);
      this.data.gradeCategories = this.fetcherData.grades.categories;
    }

    let transformThemes = () => {
      let targetTheme = this.fetcherData.themes[0];
      let subjectColors = {};
      for (let name in targetTheme.subjectColors) {
        let subjectMatching = Object.values(this.fetcherData.subjects).find(
          subject => subject.Name == name
        );
        if (!subjectMatching) continue;
        const id = subjectMatching.Id;
        subjectColors[id] = targetTheme.subjectColors[name];
      }
      this.data.subjectColors = subjectColors;
    }

    let transformUsers = () => {
      this.data.users = this.fetcherData.users;
    }

    // transform functions execution
    transformGrades();
    transformThemes();
    transformUsers();
  }

  getData() {
    return this.data;
  }

  syncErrorHandler(err, isSecondAttempt) {
    console.dir(err);
    if (err.error?.Code == "TokenIsExpired" && !isSecondAttempt) {
      this.authService.auth().subscribe(
        () => this.synchronize(true)
      )
    }
    return throwError(err);
  }

  saveLocalStorage() {
    localStorage.setItem('app.store', JSON.stringify(this.data));
  }

  restoreLocalStorage() {
    console.log('restoring storage');
    this.data = JSON.parse(localStorage.getItem('app.store')) || this.data;
    console.log('localStorage.app.store', this.data);
  }
}
