import { CategoryType } from "./category.type";
import { SubjectType } from "./subject.model";
import { UserType } from "./user.type";

export interface GradeType {
  AddDate: string, // YYYY-MM-DD HH-MM-SS
  AddedBy: UserType, // {Id: id, Url: "https://api.librus.pl/2.0/Users/id"}
  Category: CategoryType, // {Id: 771471, Url: "https://api.librus.pl/2.0/Grades/Categories/id"}
  Date: string, // YYYY-MM-DD
  Grade: string,
  Id: number,
  IsConstituent?: boolean,
  IsFinal: boolean,
  IsFinalProposition: boolean,
  IsSemester: boolean,
  IsSemesterProposition: boolean,
  Lesson: any, // {Id: id, Url: "https://api.librus.pl/2.0/Lessons/id"}
  Semester: number,
  ShowInGradesView?: boolean,
  Student: any, // {Id: id, Url: "https://api.librus.pl/2.0/Users/id"}
  Subject: SubjectType, // {Id: id, Url: "https://api.librus.pl/2.0/Subjects/id"}
  Kind: 'Grades'
      | 'DescriptiveGrades'
      | 'DescriptiveTextGrades'
      | 'TextGrades'
      | 'BehaviourGrades'
      | 'SystemProposal'
      | 'Points'
      | 'PointGrades'
}

export const GradeKinds = [
  'Grades',
  'DescriptiveGrades',
  'DescriptiveTextGrades',
  'TextGrades',
  'BehaviourGrades',
  'SystemProposal',
  'Points',
  'PointGrades'
]
