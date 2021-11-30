import { Injectable } from "@angular/core";
import { BehaviorSubject, forkJoin, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { FetcherDataType, FetcherService } from "./fetcher.service";
import { AttendanceTypeType } from "./models/attendance-type.type";
import { AttendanceType } from "./models/attendance.type";
import { CategoryType } from "./models/category.type";
import { SubjectType } from "./models/subject.type";
import { UserType } from "./models/user.type";

export type StoreDataType = {
  lastSyncTime?: number,
  gradeSubjects?: SubjectType[],
  gradeCategories?: { [key: number]: CategoryType },
  subjectColors?: { [key: number]: string },
  users?: { [key: number]: UserType },
  attendanceDays?: { [key: string]: AttendanceType[] },
  attendanceTypes?: { [key: number]: AttendanceTypeType }
};

@Injectable({ providedIn: 'root' })
export class StoreService {
  fetcherData: FetcherDataType = {};
  data: StoreDataType = {};
  dataSyncSubject = new BehaviorSubject<StoreDataType>({});
  syncInterval = 30 * 60 * 1000;

  constructor(
    private fetcherService: FetcherService,
    private authService: AuthService
  ) {
    this.restoreLocalStorage();
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

    // transform functions execution
    transformThemes();
    transformGrades();
    transformUsers();
    transformAttendanceTypes();
    transformAttendances();
  }

  scheduleNextSync() {
    const lastSyncTime = this.data.lastSyncTime || 0;
    setTimeout(() => this.synchronize(), this.data.lastSyncTime + this.syncInterval - Date.now());
  }

  getData() {
    return { ...this.data };
  }

  syncErrorHandler(err, isSecondAttempt) {
    console.dir(err);
    if (err.error?.Code == "TokenIsExpired" && !isSecondAttempt) {
      this.authService.auth().subscribe(
        () => this.synchronize(true)
      )
    }
    else {
      this.scheduleNextSync();
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
