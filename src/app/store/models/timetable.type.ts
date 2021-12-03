import { ClassroomType } from "./classroom.type";
import { LessonType } from "./lesson.type";
import { SubjectType } from "./subject.type";
import { UserType } from "./user.type";

export interface TimetableEntryType {
  Classroom: ClassroomType,
  DateFrom: string, // YYYY-MM-DD
  DateTo: string, // YYYY-MM-DD
  DayNo: string,
  HourFrom: string, // HH:MM
  HourTo: string, // HH:MM
  IsCanceled: boolean,
  IsSubstitutionClass: boolean,
  Lesson: LessonType,
  LessonNo: string,
  Subject: SubjectType,
  SubstitutionNote: any,
  Teacher: UserType,
  TimetableEntry: any,
  VirtualClass: any,
  VirtualClassName: string,

  OrgClassroom?: ClassroomType,
  OrgDate?: string,
  OrgHourFrom?: string,
  OrgHourTo?: string,
  OrgLesson?: LessonType,
  OrgLessonNo?: string,
  OrgSubject?: SubjectType,
  OrgTeacher?: UserType
}

export interface TimetableType {
  [key: string]: TimetableEntryType[][]
}
