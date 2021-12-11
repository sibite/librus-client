import { SubjectType } from "./subject.type";
import { UserType } from "./user.type";


export interface CalendarType {
  ClassFreeDays?: ClassFreeDayType[],
  HomeWorks?: HomeWorkType[],
  SchoolFreeDays?: SchoolFreeDayType[],
  Substitutions?: SubstitutionType[],
  TeacherFreeDays?: TeacherFreeDayType[],
  ParentTeacherConferences?: ParentTeacherConferences[]
}

export interface CalendarEntryBaseType {
  AddDate: string, // YYYY-MM-DD HH:MM:SS
  DateFrom: string, // YYYY-MM-DD
  DateTo: string, // YYYY-MM-DD
  Id: number,
  Name: string,
  Kind?: CalendarKindType
}

export interface SchoolFreeDayType extends CalendarEntryBaseType {}

export interface ClassFreeDayType extends CalendarEntryBaseType {
  Class: any,
  Type: { Id: number, Name: string },
  VirtualClass: any,
  LessonFrom?: string,
  LessonTo?: string,
  TimeFrom?: string, // HH:MM:SS
  TimeTo?: string, // HH:MM:SS
  Kind?: CalendarKindType
}

export interface TeacherFreeDayType extends CalendarEntryBaseType {
  Teacher: UserType,
  Name: string,
  LessonFrom?: string,
  LessonTo?: string,
  TimeFrom?: string, // HH:MM:SS
  TimeTo?: string, // HH:MM:SS
  Kind?: CalendarKindType
}

export interface SubstitutionType {
  Id: number,
  IsCancelled: boolean,
  IsShifted: boolean,
  OrgDate: string, // YYYY-MM-DD
  OrgLessonNo: string,
  OrgSubject: SubjectType,
  OrgTeacher: UserType,
  Date: string, // YYYY-MM-DD
  LessonNo: string,
  Subject: SubjectType,
  Teacher: UserType,
  Kind?: CalendarKindType
}

export interface HomeWorkType {
  AddDate: string, // YYYY-MM-DD HH:MM:SS
  Category: {Id: number, Name: string},
  Content: string,
  CreatedBy: UserType,
  Date: string, // YYYY-MM-DD
  Id: number,
  LessonNo: string,
  Subject: SubjectType,
  TimeFrom: string, // HH:MM:SS
  TimeTo: string, // HH:MM:SS
  VirtualClass: any,
  Kind?: CalendarKindType
}

export interface ParentTeacherConferences {
  Class: any,
  Date: string, // YYYY-MM-DD
  Id: number,
  Name: string,
  Room: string,
  Teacher: UserType,
  Time: string, // HH:MM:SS
  Topic: string,
  Kind?: CalendarKindType
}

export interface AnyCalendarEntryType {
  AddDate?: string, // YYYY-MM-DD HH:MM:SS
  Category?: {Id: number, Name: string},
  Content?: string,
  CreatedBy?: UserType,
  Date?: string, // YYYY-MM-DD
  Id?: number,
  LessonNo?: string,
  Subject?: SubjectType,
  TimeFrom?: string, // HH:MM:SS
  TimeTo?: string, // HH:MM:SS
  VirtualClass?: any,
  Kind?: CalendarKindType,
  Class?: any,
  Name?: string,
  Room?: string,
  Teacher?: UserType,
  Time?: string, // HH:MM:SS
  Topic?: string,
  Type?: { Id: number, Name: string },
  IsCancelled?: boolean,
  IsShifted?: boolean,
  OrgDate?: string, // YYYY-MM-DD
  OrgLessonNo?: string,
  OrgSubject?: SubjectType,
  OrgTeacher?: UserType,
  DateFrom?: string, // YYYY-MM-DD
  DateTo?: string, // YYYY-MM-DD
};


export type CalendarEntryType = ClassFreeDayType
  | HomeWorkType
  | SchoolFreeDayType
  | SubstitutionType
  | TeacherFreeDayType
  | ParentTeacherConferences;

export type CalendarKindType =
  'ClassFreeDays'
  | 'HomeWorks'
  | 'SchoolFreeDays'
  | 'Substitutions'
  | 'TeacherFreeDays'
  | 'ParentTeacherConferences';

export const CalendarKinds = [
  {
    name: 'Calendars/ClassFreeDays',
    propName: 'ClassFreeDays'
  }, {
    name: 'HomeWorks',
    propName: 'HomeWorks'
  }, {
    name: 'Calendars/SchoolFreeDays',
    propName: 'SchoolFreeDays'
  }, {
    name: 'Calendars/Substitutions',
    propName: 'Substitutions'
  }, {
    name: 'Calendars/TeacherFreeDays',
    propName: 'TeacherFreeDays'
  }, {
    name: 'ParentTeacherConferences',
    propName: 'ParentTeacherConferences'
  }
];

export const CalendarKindNames = CalendarKinds.map(kind => kind.propName);
