import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { forkJoin, Subject, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
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
  grades?: SubjectType[],
  gradeCategories?: { [key: number]: CategoryType },
  subjectColors?: { [key: number]: string }
};

@Injectable({ providedIn: 'root' })
export class StoreService {
  fetcherData: FetcherDataType = {};
  data: StoreDataType = {};
  dataSyncSubject = new Subject<StoreDataType>();

  constructor(
    private http: HttpClient,
    private fetcherService: FetcherService
  ) {
    this.restoreLocalStorage();
    const lastSyncTime = this.data.lastSyncTime || 0;
    if (Date.now() - lastSyncTime > 1800 * 1000) {
      this.synchronize();
    }
  }

  synchronize() {
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
        catchError(this.errorHandler.bind(this))
      )
      .subscribe(forkResponse => {
        this.fetcherData = forkResponse;
        this.transformFetcherData();
        this.data.lastSyncTime = Date.now();
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
      this.data.grades = Object.values(gradesSubjects);
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

    // transform functions execution
    transformGrades();
    transformThemes();
    // emit sync subject
    this.dataSyncSubject.next(this.data);
  }

  getData() {
    return this.data;
  }

  errorHandler(err) {
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
