import { AttendanceTypeType } from "./attendance-type.type";
import { LessonType } from "./lesson.type";
import { UserType } from "./user.type";

export interface AttendanceType {
  AddDate: string,
  AddedBy: UserType,
  Date: string,
  Id: number,
  Lesson: LessonType,
  LessonNo: number,
  Semester: number,
  Student: any,
  Type: AttendanceTypeType
}
