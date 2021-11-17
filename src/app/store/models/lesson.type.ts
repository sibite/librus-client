import { SubjectType } from "./subject.model";
import { UserType } from "./user.type";

export interface LessonType {
  Class?: any,
  Id: number,
  Subject: SubjectType,
  Teacher: UserType
}
