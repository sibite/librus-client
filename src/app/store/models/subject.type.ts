import { GradeType } from "./grade.type";

export interface SubjectType {
  Id: number,
  IsBlockLesson: boolean,
  IsExtracurricular: boolean,
  Name: string,
  No: number,
  Short: string,
  Grades?: GradeType[], // not served by API
  Color?: string, // not served by API
  Url?: string
}
