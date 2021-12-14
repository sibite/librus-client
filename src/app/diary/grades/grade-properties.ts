import { convertLibrusDate, formatDate } from "src/app/shared/date-utilities";
import { generateDetailsListHTML } from "src/app/shared/generate-details-list";
import { CapitalizePipe } from "src/app/shared/pipes/capitalize.pipe";
import { GradeType } from "src/app/store/models/grade.type";

export function getGradeDetailsHTML(grade: GradeType) {
  let properties = [
    { name: 'Ocena', content: grade.Kind.startsWith('BehaviourGrades') ? CapitalizePipe.prototype.transform(grade.GradeType.Name) : grade.Grade },
    { name: 'Kategoria', content: CapitalizePipe.prototype.transform( grade.Category?.Name || '' ) || null },
    { name: 'Komentarz', content: CapitalizePipe.prototype.transform( grade.Comments?.map(comment => comment.Text).join('\n\n') || '' ) || null },
    { name: 'Waga', content: grade.Category.Weight },
    { name: 'Licz do średniej', content: grade.Kind === 'Grades' ? (grade.IsConstituent ? 'Tak' : 'Nie') : null },
    { name: 'Data uzyskania', content: grade.Date ? convertLibrusDate(grade.Date).toLocaleDateString('pl-PL') : null },
    { name: 'Data dodania', content: !grade.Date ? formatDate(convertLibrusDate(grade.AddDate), 'time') : null },
    { name: 'Dodano przez', content: grade.AddedBy ? grade.AddedBy.FirstName + ' ' + grade.AddedBy.LastName : null },
  ];

  return generateDetailsListHTML(properties);
}
