import { SubjectType } from "./subject.type";
import { UserType } from "./user.type";

export interface LessonType {
  Class?: any,
  Id: number,
  Subject: SubjectType,
  Teacher: UserType
  Url?: string
}
