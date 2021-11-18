export interface SchoolInfoType {
  ApartmentNumber: string,
  BuildingNumber: string,
  Id: number,
  LessonsRange: {From: string, To: string, RawFrom: number, RawTo: number}[],
  Name: string,
  NameHeadTeacher: string,
  PostCode: string,
  Project: number,
  SchoolYear: number,
  Service: {},
  State: string,
  Street: string,
  SurnameHeadTeacher: string,
  Town: string,
  VocationalSchool: string
}
