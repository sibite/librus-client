import { UserType } from "./user.type"

export interface CategoryType {
  AdultsDaily: boolean,
  AdultsExtramural: boolean,
  BlockAnyGrades: boolean,
  Teacher?: Partial<UserType>,
  Color: {Id: number, Url?: string},
  CountToTheAverage: boolean,
  Id: number,
  IsReadOnly: string,
  Name: string,
  ObligationToPerform: boolean,
  Standard: boolean,
  Weight?: number,
  Short?: string,
  Url?: string,
  IsSemestral?: boolean,
  IsFinalProposition?: boolean,
  ForLessons?: any,
}

export interface CategoriesType {
  'Grades': { [ key: number]: CategoryType },
  'DescriptiveGrades': { [ key: number]: CategoryType },
  'DescriptiveTextGrades': { [ key: number]: CategoryType },
  'TextGrades': { [ key: number]: CategoryType },
  'BehaviourGrades': { [ key: number]: CategoryType },
  'BehaviourGrades/SystemProposal': { [ key: number]: CategoryType },
  'BehaviourGrades/Points': { [ key: number]: CategoryType },
  'PointGrades': { [ key: number]: CategoryType }
}

export interface BehaviourType {
  Id: number,
  Name: string,
  Shortcut: string,
  Url?: string,
}
