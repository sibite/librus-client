import { BehaviourType, CategoryType } from "./category.type";
import { CommentType } from "./comment.type";
import { SubjectType } from "./subject.type";
import { UserType } from "./user.type";

export interface GradeType {
  AddDate: string, // YYYY-MM-DD HH-MM-SS
  AddedBy: Partial<UserType>, // {Id: id, Url: "https://api.librus.pl/2.0/Users/id"}
  Teacher?: Partial<UserType>,
  Category: Partial<CategoryType>, // {Id: 771471, Url: "https://api.librus.pl/2.0/Grades/Categories/id"}
  GradeType?: Partial<BehaviourType>,
  Comments?: CommentType[],
  Date: string, // YYYY-MM-DD
  Grade: string,
  Id: number,
  IsConstituent?: boolean,
  IsFinal: boolean,
  IsFinalProposition: boolean,
  IsSemester: boolean,
  IsSemesterProposition: boolean,
  IsProposal?: string,
  IsNormal: boolean, // not served by API
  Lesson: any, // {Id: id, Url: "https://api.librus.pl/2.0/Lessons/id"}
  Semester: number | string,
  ShowInGradesView?: boolean,
  Student: any, // {Id: id, Url: "https://api.librus.pl/2.0/Users/id"}
  Subject: Partial<SubjectType>, // {Id: id, Url: "https://api.librus.pl/2.0/Subjects/id"}
  Kind: GradeKindType, // not served by API
}

export type GradeKindType = 'Grades'
  | 'DescriptiveGrades'
  | 'DescriptiveTextGrades'
  | 'TextGrades'
  | 'BehaviourGrades'
  | 'BehaviourGrades/SystemProposal'
  | 'BehaviourGrades/Points'
  | 'PointGrades';

export const GradeKinds = [
  {
    name: 'Grades',
    propName: 'Grades'
  }, {
    name: 'DescriptiveGrades',
    propName: 'Grades'
  }, {
    name: 'DescriptiveTextGrades',
    propName: 'Grades'
  }, {
    name: 'TextGrades',
    propName: 'Grades'
  }, {
    name: 'BehaviourGrades',
    propName: 'Grades'
  }, {
    name: 'BehaviourGrades/SystemProposal',
    propName: 'SystemProposal'
  }, {
    name: 'BehaviourGrades/Points',
    propName: 'Grades'
  }, {
    name: 'PointGrades',
    propName: 'Grades'
  },
]

export const GradeKindNames = GradeKinds.map(kind => kind.name);
