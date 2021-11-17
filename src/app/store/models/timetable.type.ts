import { LessonType } from "./lesson.type";
import { SubjectType } from "./subject.type";
import { UserType } from "./user.type";

export interface TimetableEntryType {
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
  VirtualClassName: string
}

export interface TimetableType {
  [key: string]: TimetableEntryType[][]
}
