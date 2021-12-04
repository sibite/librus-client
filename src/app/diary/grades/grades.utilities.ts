import { convertLibrusDate } from "src/app/shared/date-utilities";
import { GradeType } from "src/app/store/models/grade.type";

export function gradesByDateSorter(a, b) {
  let date1 = convertLibrusDate(a.Date);
  let date2 = convertLibrusDate(b.Date);
  let diff = date1.getTime() - date2.getTime();

  if (diff !== 0) return diff;

  let addDate1 = convertLibrusDate(a.AddDate);
  let addDate2 = convertLibrusDate(b.AddDate);

  return addDate1.getTime() - addDate2.getTime();
}

export function formatGradeShort(grade: GradeType) {
  switch (grade.Kind) {
    case 'TextGrades':
      return 'T';
    default:
      return grade.Grade;
  }
}
