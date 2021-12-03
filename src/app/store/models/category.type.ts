export interface CategoryType {
  AdultsDaily: boolean,
  AdultsExtramural: boolean,
  BlockAnyGrades: boolean,
  Color: {Id: number},
  CountToTheAverage: boolean,
  Id: number,
  IsReadOnly: string,
  Name: string,
  ObligationToPerform: boolean,
  Standard: boolean,
  Weight: number
  Url?: string
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
