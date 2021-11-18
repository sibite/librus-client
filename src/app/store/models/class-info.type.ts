export interface ClassInfoType {
  BeginSchoolYear: string, // YYYY-MM-DD
  ClassTutor: {Id: number, Url?: string},
  ClassTutors: {Id: number, Url?: string}[],
  EndFirstSemester: string, // YYYY-MM-DD
  EndSchoolYear: string, // YYYY-MM-DD
  Id: number,
  Number: number,
  Symbol: string,
  Unit: {}
}
