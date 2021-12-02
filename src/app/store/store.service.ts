import { Injectable } from "@angular/core";
import { BehaviorSubject, forkJoin, throwError } from "rxjs";
import { catchError, take } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { convertLibrusDate, toDateString, toMiddayDate, toWeekStartDate } from "../shared/date-converter";
import { FetcherDataType, FetcherService } from "./fetcher.service";
import { AttendanceTypeType } from "./models/attendance-type.type";
import { AttendanceType } from "./models/attendance.type";
import { CalendarEntryType } from "./models/calendar.type";
import { CategoryType } from "./models/category.type";
import { ClassInfoType } from "./models/class-info.type";
import { SchoolInfoType } from "./models/school-info.type";
import { SubjectType } from "./models/subject.type";
import { TimetableEntryType } from "./models/timetable.type";
import { UserType } from "./models/user.type";

export type StoreDataType = {
  lastSyncTime?: number,
  timetablesLastSync?: { [key: string]: number },
  unitInfo?: {
    school: SchoolInfoType,
    class: ClassInfoType
  }
  gradeSubjects?: SubjectType[],
  gradeCategories?: { [key: number]: CategoryType },
  subjectColors?: { [key: number]: string },
  users?: { [key: number]: UserType },
  attendanceDays?: { [key: string]: AttendanceType[] },
  attendanceTypes?: { [key: number]: AttendanceTypeType },
  timetableDays?: { [key: string]: TimetableEntryType[][] },
  calendar?: { [key: string]: CalendarEntryType[] }
};

@Injectable({ providedIn: 'root' })
export class StoreService {
  fetcherData: FetcherDataType = {};
  data: StoreDataType = {};
  dataSyncSubject = new BehaviorSubject<StoreDataType>({});
  syncInterval = 30 * 60e3;
  timetableSyncMaxOffset = 5 * 60e3;
  timetableErrors?: { [key: string]: boolean} = {};

  constructor(
    private fetcherService: FetcherService,
    private authService: AuthService
  ) {
    this.restoreLocalStorage();
    this.data.timetableDays ??= {};
    this.data.timetablesLastSync ??= {};
    this.dataSyncSubject.next(this.getData());
    this.scheduleNextSync();
  }

  synchronize(isSecondAttempt = false) {
    const queueMap = {
      subjects: this.fetcherService.fetchSubjects(),
      users: this.fetcherService.fetchUsers(),
      grades: this.fetcherService.fetchGrades(),
      lessons: this.fetcherService.fetchLessons(),
      attendanceTypes: this.fetcherService.fetchAttendanceTypes(),
      attendances: this.fetcherService.fetchAttendances(),
      classrooms: this.fetcherService.fetchClassrooms(),
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
        this.loadTimetable(new Date());
        // emit sync subject
        this.dataSyncSubject.next(this.getData());
        this.data.lastSyncTime = Date.now();
        this.scheduleNextSync();
        this.saveLocalStorage();
        console.log(this.getData());
      });
  }

  transformFetcherData() {
    // transform functions (tidying messy api responses)

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

    let transformGrades = () => {
      let gradesSubjects = { ...this.fetcherData.subjects };
      for (let subject of Object.values(gradesSubjects)) {
        subject.Color = this.data.subjectColors[subject.Id];
        subject.Grades = [];
      }
      for (let grade of this.fetcherData.grades.list) {
        // attaching added by
        let addedBy = this.fetcherData.users[grade.AddedBy.Id]
        grade.AddedBy = {
          ...grade.AddedBy,
           FirstName: addedBy.FirstName,
           LastName: addedBy.LastName
        }
        // attaching categories
        let category = this.fetcherData.grades.categories.find(
          category => category.Id == grade.Category.Id
        );
        grade.Category = {
          ...grade.Category,
          Name: category.Name,
          Weight: category.Weight
        }
        // attaching comments
        if (grade.Comments) {
          let comments = grade.Comments.map(gradeComment => {
            return this.fetcherData.grades.comments.find(
              storeComment => storeComment.Id == gradeComment.Id
            )
          });
          grade.Comments = comments;
        }
        gradesSubjects[grade.Subject.Id].Grades.push(grade);
      }
      this.data.gradeSubjects = Object.values(gradesSubjects);
      this.data.gradeCategories = this.fetcherData.grades.categories;
    }

    let transformUsers = () => {
      this.data.users = this.fetcherData.users;
    }

    let transformAttendanceTypes = () => {
      let attendanceTypes = this.fetcherData.attendanceTypes;
      this.data.attendanceTypes = attendanceTypes;
    }

    let transformAttendances = () => {
      let attendances = this.fetcherData.attendances;
      let attendancesObj = {};
      for (let attendance of attendances) {
        // attaching added by
        let addedBy = this.fetcherData.users[attendance.AddedBy.Id]
        attendance.AddedBy = {
          ...attendance.AddedBy,
           FirstName: addedBy.FirstName,
           LastName: addedBy.LastName
        }
        // attaching type
        // assigning direct object because it's repetitive and has no nested objects
        let type = this.data.attendanceTypes[attendance.Type.Id];
        attendance.Type = type;
        // attaching lesson
        let lesson = this.fetcherData.lessons[attendance.Lesson.Id];
        let subject = this.fetcherData.subjects[lesson.Subject.Id];
        attendance.Lesson.Subject = {
          ...lesson.Subject,
          Name: subject.Name,
          Color: subject.Color
        };
        // pushing it to object with dates as keys
        if (typeof attendancesObj[attendance.Date] !== 'object') {
          attendancesObj[attendance.Date] = [];
        }
        attendancesObj[attendance.Date].push(attendance);
      }
      this.data.attendanceDays = attendancesObj;
    }

    let transformCalendar = () => {
      let calendarOrg = this.fetcherData.calendar;
      let calendarNew = {};

      function addToCalendar(entry) {
        if (entry.Date) {
          (calendarNew[entry.Date] ??= []).push(entry);
        }
        else if (entry.DateFrom && entry.DateTo) {
          let from = toMiddayDate(convertLibrusDate(entry.DateFrom));
          let to = toMiddayDate(convertLibrusDate(entry.DateTo));
          for (let i = 0; i <= (to.getTime() - from.getTime()) / 86400e3; i++) {
            let date = toDateString(new Date(from.getTime() + 86400e3 * i));
            (calendarNew[date] ??= []).push(entry);
          }
        }
      }

      for (let kind of Object.keys(calendarOrg)) {
        for (let entry of calendarOrg[kind]) {
          entry.Kind = kind;
          addToCalendar(entry);
        }
      }

      this.data.calendar = calendarNew;
    }

    let transformUnitInfo = () => {
      this.data.unitInfo = this.fetcherData.unitInfo;
      delete this.data.unitInfo.school.LessonsRange[0];
    }

    // transform functions execution
    transformThemes();
    transformGrades();
    transformUsers();
    transformAttendanceTypes();
    transformAttendances();
    transformCalendar();
    transformUnitInfo();
  }

  loadTimetable(date: Date, isSecondAttempt = false) {
    let weekStart = toWeekStartDate(date);
    // format: YYYY-MM-DD
    let dateString = toDateString(weekStart);
    let syncOffset = Date.now() - (this.data.timetablesLastSync[dateString] || Infinity);
    if (this.timetableSyncMaxOffset > syncOffset) {
      this.fetcherService.fetchTimetable(dateString).pipe(
          take(1),
          catchError(err => {
            return this.timetableErrorHandler(err, date, isSecondAttempt);
          })
        ).subscribe(
        timetable => {
          console.log(timetable);
          for (let day of Object.keys(timetable)) {
            this.data.timetableDays[day] = timetable[day];
          }
          this.data.timetablesLastSync[dateString] = Date.now();
          this.timetableErrors[dateString] = false;
          this.dataSyncSubject.next(this.getData());
          this.saveLocalStorage();
        }
      );
    }
  }

  scheduleNextSync(lastFailed = false) {
    const lastSyncTime = !lastFailed ? this.data.lastSyncTime || Date.now() - this.syncInterval : Date.now();
    setTimeout(() => this.synchronize(), lastSyncTime + this.syncInterval - Date.now());
  }

  syncErrorHandler(err, isSecondAttempt) {
    console.error(err);
    if (err.error?.Code == "TokenIsExpired" && !isSecondAttempt) {
      this.authService.auth().subscribe(
        () => this.synchronize(true)
      )
    }
    else {
      this.scheduleNextSync(true);
    }
    return throwError(err);
  }

  timetableErrorHandler(err, date, isSecondAttempt) {
    console.error(err);
    if (err.error?.Code == "TokenIsExpired" && !isSecondAttempt) {
      this.authService.auth().subscribe(
        () => this.loadTimetable(date, true)
      )
    }
    else {
      this.timetableErrors[toDateString(date)] = true;
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

  getData() {
    return { ...this.data };
  }
}
