import { SubjectType } from "./subject.type";
import { UserType } from "./user.type";

export interface LessonType {
  Class?: any,
  Id: number,
  Subject: Partial<SubjectType>,
  Teacher?: Partial<UserType>,
  Url?: string
}
