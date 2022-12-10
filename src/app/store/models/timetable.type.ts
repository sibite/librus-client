import { ClassroomType } from "./classroom.type";
import { LessonType } from "./lesson.type";
import { SubjectType } from "./subject.type";
import { UserType } from "./user.type";

export interface TimetableEntryType {
  Classroom: Partial<ClassroomType>,
  Class?: any,
  DateFrom: string, // YYYY-MM-DD
  DateTo: string, // YYYY-MM-DD
  DayNo: string,
  HourFrom: string, // HH:MM
  HourTo: string, // HH:MM
  IsCanceled: boolean,
  IsSubstitutionClass: boolean,
  Lesson: Partial<LessonType>,
  LessonNo: string,
  Subject: Partial<SubjectType>,
  SubstitutionNote: any,
  SubstitutionClassUrl?: any,
  Teacher: Partial<UserType>,
  TimetableEntry: any,
  VirtualClass?: any,
  VirtualClassName?: string,

  OrgClassroom?: ClassroomType | any,
  OrgDate?: string,
  OrgHourFrom?: string,
  OrgHourTo?: string,
  OrgLesson?: Partial<LessonType>,
  OrgLessonNo?: string,
  OrgSubject?: SubjectType | any,
  OrgTeacher?: UserType | any
}

export interface TimetableType {
  [key: string]: TimetableEntryType[][]
}
