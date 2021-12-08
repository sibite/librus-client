import { UserType } from "./user.type";

export interface ClassInfoType {
  BeginSchoolYear: string, // YYYY-MM-DD
  ClassTutor: UserType,
  ClassTutors: UserType[],
  EndFirstSemester: string, // YYYY-MM-DD
  EndSchoolYear: string, // YYYY-MM-DD
  Id: number,
  Number: number,
  Symbol: string,
  Unit: {}
}
