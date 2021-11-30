import { convertLibrusDate } from "src/app/shared/date-converter";
import { generateDetailsListHTML } from "src/app/shared/generate-details-list";
import { CapitalizePipe } from "src/app/shared/pipes/capitalize.pipe";
import { GradeType } from "src/app/store/models/grade.type";

export function getGradeDetailsHTML(grade: GradeType) {
  let properties = [
    { name: 'Ocena', content: grade.Grade },
    { name: 'Kategoria', content: CapitalizePipe.prototype.transform( grade.Category.Name ) },
    { name: 'Komentarz', content: CapitalizePipe.prototype.transform( grade.Comments?.map(comment => comment.Text).join('\n\n') || '' ) || null },
    { name: 'Waga', content: grade.Category.Weight },
    { name: 'Licz do średniej', content: grade.Kind === 'Grades' ? (grade.IsConstituent ? 'Tak' : 'Nie') : null },
    { name: 'Data', content: convertLibrusDate(grade.Date || grade.AddDate).toLocaleDateString('pl-PL') },
    { name: 'Dodano przez', content: grade.AddedBy.FirstName + ' ' + grade.AddedBy.LastName },
  ];

  return generateDetailsListHTML(properties);
}
