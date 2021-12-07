import { Injectable } from "@angular/core";
import { BehaviorSubject, forkJoin, of, throwError } from "rxjs";
import { catchError, map, take, tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { convertLibrusDate, toDateString, toMiddayDate, toWeekStartDate } from "../shared/date-utilities";
import { FetcherDataType, FetcherService } from "./fetcher.service";
import { AttendanceTypeType } from "./models/attendance-type.type";
import { AttendanceType } from "./models/attendance.type";
import { CalendarEntryType } from "./models/calendar.type";
import { CategoriesType } from "./models/category.type";
import { ClassInfoType } from "./models/class-info.type";
import { ClassroomType } from "./models/classroom.type";
import { GradeType } from "./models/grade.type";
import { SchoolInfoType } from "./models/school-info.type";
import { SubjectType } from "./models/subject.type";
import { TimetableEntryType } from "./models/timetable.type";
import { UserType } from "./models/user.type";
import { assignProperties } from "./transform-utilities";

export interface StoreDataType {
  lastSyncTime?: number,
  timetablesLastSync?: { [key: string]: number },
  unitInfo?: {
    school: SchoolInfoType,
    class: ClassInfoType
  }
  gradeSubjects?: SubjectType[],
  gradeCategories?: CategoriesType;
  subjects?: { [key: number]: SubjectType },
  subjectColors?: { [key: number]: string },
  users?: { [key: number]: UserType },
  attendanceDays?: { [key: string]: AttendanceType[] },
  attendanceTypes?: { [key: number]: AttendanceTypeType },
  timetableDays?: { [key: string]: TimetableEntryType[][] },
  classrooms?: { [key: number]: ClassroomType },
  calendar?: { [key: string]: CalendarEntryType[] }
};

export interface SyncStateType {
  offline: boolean,
  syncing: boolean,
  timetableSyncing: boolean,
  error: boolean
}

const initialSyncState = {
  offline: false,
  syncing: false,
  timetableSyncing: false,
  error: false
}

@Injectable({ providedIn: 'root' })
export class StoreService {
  fetcherData: FetcherDataType = {};
  data: StoreDataType = {
    timetableDays: {},
    timetablesLastSync: {}
  };
  syncState: SyncStateType = initialSyncState;
  scheduledTimeout;

  dataSyncSubject = new BehaviorSubject<StoreDataType>({});
  syncStateSubject = new BehaviorSubject<SyncStateType>(this.syncState);
  syncInterval = 60 * 60e3;
  timetableSyncMaxOffset = 30 * 60e3;
  timetableErrors?: { [key: string]: boolean } = {};

  constructor(
    private fetcherService: FetcherService,
    private authService: AuthService
  ) {
    this.restoreLocalStorage();
    this.init();

    // network mode
    this.syncState.offline = !window.navigator.onLine;
    this.syncStateSubject.next(this.syncState);
    // online mode
    window.addEventListener('online', () => {
      this.syncState.offline = false;
      this.syncStateSubject.next(this.syncState);
      if (this.syncState.error) {
        this.synchronize();
      }
    })
    // offline mode
    window.addEventListener('offline', () => {
      this.syncState.offline = true;
      this.syncStateSubject.next(this.syncState);
    })
  }

  init() {
    this.data.timetableDays ??= {};
    this.data.timetablesLastSync ??= {};
    this.dataSyncSubject.next(this.getData());
    this.scheduleNextSync();
  }

  synchronize(isSecondAttempt = false) {
    if (!this.authService.authState?.loggedIn) return;

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

    this.syncState.syncing = true;
    this.syncState.error = false;
    this.syncStateSubject.next(this.syncState);

    forkJoin(queueMap)
      .pipe(
        catchError(err => {
          return this.syncErrorHandler(err, isSecondAttempt);
        })
      )
      .subscribe(forkResponse => {
        this.syncState.syncing = false;
        this.syncStateSubject.next(this.syncState);
        this.fetcherData = forkResponse;
        this.transformFetcherData();
        this.syncState.error = false;
        this.syncStateSubject.next(this.syncState);
        this.dataSyncSubject.next(this.getData());
        this.data.lastSyncTime = Date.now();
        this.scheduleNextSync();
        this.saveLocalStorage();
        this.loadTimetable(new Date()).pipe(take(1)).subscribe();

        console.log(this.getData());
        console.log(this.fetcherData)
      });
  }

  transformFetcherData() {
    // transform functions (tidying messy api responses)
    let requireFields = function(fields: any[]): boolean {
      let allPresent = true;
      fields.forEach(field => {
        if (!this.fetcherData[field]) allPresent = false;
      });
      return allPresent;
    }.bind(this);

    let transformThemes = () => {
      if (!requireFields(['themes', 'subjects'])) return;

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
      if (!requireFields(['themes', 'subjects', 'grades'])) return;

      let gradesSubjects = { ...this.fetcherData.subjects };
      for (let subject of Object.values(gradesSubjects)) {
        subject.Color = this.data.subjectColors[subject.Id];
        subject.Grades = [];
      }
      for (let grade of this.fetcherData.grades.list) {
        // attaching added by
        assignProperties(grade.AddedBy, this.fetcherData.users, ['FirstName', 'LastName']);
        // attaching categories
        assignProperties(grade.Category, this.fetcherData.grades.categories[grade.Kind], ['Name', 'Weight']);
        // attaching comments
        if (grade.Comments) {
          grade.Comments = grade.Comments.map(comment => {
            return this.fetcherData.grades.comments[grade.Kind][comment.Id];
          })
        }
        grade.IsNormal = !(grade.IsFinalProposition || grade.IsFinal || grade.IsSemester || grade.IsSemesterProposition);
        if (gradesSubjects[grade.Subject.Id]) {
          gradesSubjects[grade.Subject.Id].Grades.push(grade);
        }
      }
      this.data.gradeSubjects = Object.values(gradesSubjects);
      this.data.gradeCategories = this.fetcherData.grades.categories;
    }

    let transformUsers = () => {
      if (!requireFields(['users'])) return;

      this.data.users = this.fetcherData.users;
    }

    let transformAttendanceTypes = () => {
      if (!requireFields(['attendanceTypes'])) return;

      let attendanceTypes = this.fetcherData.attendanceTypes;
      this.data.attendanceTypes = attendanceTypes;
    }

    let transformAttendances = () => {
      if (!requireFields(['users', 'attendances', 'attendanceTypes', 'lessons', 'subjects'])) return;

      let attendances = this.fetcherData.attendances;
      let attendancesObj = {};
      for (let attendance of attendances) {
        // attaching added by
        assignProperties(attendance.AddedBy, this.fetcherData.users, ['FirstName', 'LastName'])
        // attaching type
        // assigning direct object because it's repetitive and has no nested objects
        let type = this.data.attendanceTypes[attendance.Type.Id];
        attendance.Type = type;
        // attaching lesson
        assignProperties(attendance.Lesson, this.fetcherData.lessons, ['Subject']);
        assignProperties(attendance.Lesson.Subject, this.fetcherData.subjects, ['Name', 'Color']);
        // pushing it to object with dates as keys
        if (typeof attendancesObj[attendance.Date] !== 'object') {
          attendancesObj[attendance.Date] = [];
        }
        attendancesObj[attendance.Date].push(attendance);
      }
      this.data.attendanceDays = attendancesObj;
    }

    let transformClassrooms = () => {
      if (!requireFields(['classrooms'])) return;

      this.data.classrooms = this.fetcherData.classrooms;
    }

    let transformCalendar = () => {
      if (!requireFields(['calendar', 'subjects', 'users'])) return;

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
          assignProperties(entry.Subject, this.fetcherData.subjects, ['Name']);
          assignProperties(entry.Teacher, this.fetcherData.users, ['FirstName', 'LastName']);
          assignProperties(entry.CreatedBy, this.fetcherData.users, ['FirstName', 'LastName']);
          addToCalendar(entry);
        }
      }

      this.data.calendar = calendarNew;
    }

    let transformOthers = () => {
      // unit info
      if (!requireFields(['unitInfo'])) return;
      this.data.unitInfo = this.fetcherData.unitInfo;
      delete this.data.unitInfo.school.LessonsRange[0];

      // subjects
      if (!requireFields(['subjects'])) return;
      this.data.subjects = this.fetcherData.subjects;
    }

    // transform functions execution
    transformThemes();
    transformGrades();
    transformUsers();
    transformAttendanceTypes();
    transformAttendances();
    transformClassrooms();
    transformCalendar();
    transformOthers();
  }

  loadTimetable(date: Date, isSecondAttempt = false, force = false) {

    let weekStart = toWeekStartDate(date);
    let dateString = toDateString(weekStart);

    if (this.isTimetableDayUpToDate(date) && !force) {
      return of(this.data.timetableDays);
    }

    return this.fetcherService.fetchTimetable(dateString).pipe(
      take(1),
      catchError(err => {
        return this.timetableErrorHandler(err, date, isSecondAttempt);
      }),
      map(timetable => {
        console.log(timetable);
        for (let day of Object.keys(timetable)) {
          this.transformTimetableDay(timetable[day]);
          this.data.timetableDays[day] = timetable[day];
        }
        this.data.timetablesLastSync[dateString] = Date.now();
        this.timetableErrors[dateString] = false;
        this.dataSyncSubject.next(this.getData());
        this.saveLocalStorage();
        return this.data.timetableDays;
      })
    );
  }

  transformTimetableDay(day: TimetableEntryType[][]) {
    for (let range of day) {
      for (let lesson of range) {
        const classroom = this.data.classrooms[lesson.Classroom?.Id];
        lesson.Classroom = {
          ...lesson.Classroom,
          Name: classroom?.Name
        }
        if (lesson.IsSubstitutionClass) {
          const orgClassroom = this.data.classrooms[lesson.OrgClassroom.Id];
          const orgSubject = this.data.subjects[lesson.OrgSubject.Id];
          const orgTeacher = this.data.users[lesson.OrgTeacher.Id];
          lesson.OrgClassroom.Name = orgClassroom.Name;
          lesson.OrgSubject.Name = orgSubject.Name;
          lesson.OrgTeacher = {
            ...lesson.OrgTeacher,
            FirstName: orgTeacher.FirstName,
            LastName: orgTeacher.LastName
          }
        }
      }
    }
  }

  isTimetableDayUpToDate(date: Date) {
    let weekStart = toWeekStartDate(date);
    let dateString = toDateString(weekStart);
    let syncOffset = Date.now() - (this.data.timetablesLastSync[dateString] || -Infinity);
    return syncOffset <= this.timetableSyncMaxOffset;
  }

  scheduleNextSync(lastFailed = false) {
    const lastSyncTime = !lastFailed ? this.data.lastSyncTime || Date.now() - this.syncInterval : Date.now();
    clearTimeout(this.scheduledTimeout);
    this.scheduledTimeout = setTimeout(() => this.synchronize(), lastSyncTime + this.syncInterval - Date.now());
  }

  syncErrorHandler(err, isSecondAttempt) {
    // temp
    console.error(err);
    console.log(err.error?.Code, isSecondAttempt);

    const onError = () => {
      console.log('dupa error ')
      this.syncState.syncing = false;
      this.syncState.error = true;
      this.syncStateSubject.next(this.syncState);
      this.scheduleNextSync(true);
    }

    if ((err.error?.Code == "TokenIsExpired" || err.status == 401) && !isSecondAttempt) {
      this.syncState.syncing = false;
      this.syncStateSubject.next(this.syncState);
      this.authService.auth().pipe(take(1)).subscribe(
        () => this.synchronize(true),
        () => onError()
      );
    }
    onError();
    return throwError(err);
  }

  timetableErrorHandler(err, date, isSecondAttempt) {
    console.error(err);
    if ((err.error?.Code == "TokenIsExpired" || err.status == 401) && !isSecondAttempt) {
      this.authService.auth().pipe(take(1)).subscribe(
        () => this.loadTimetable(date, true).pipe(take(1)).subscribe(),
        () => this.timetableErrors[toDateString(date)] = true
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

  clearData() {
    this.data = {};
    clearTimeout(this.scheduledTimeout);
    localStorage.removeItem('app.store');
  }

  getData() {
    return { ...this.data };
  }
}
