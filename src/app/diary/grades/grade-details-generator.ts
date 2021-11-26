import { convertLibrusDate } from "src/app/shared/date-converter";
import { GradeType } from "src/app/store/models/grade.type";

export function generateGradeDetailsHTML(grade: GradeType) {
  let detailsContainerEl = document.createElement('div');
  let listEl = document.createElement('ul');
  listEl.classList.value = 'ui details-list';
  detailsContainerEl.appendChild(listEl);

  let propertyList = [
    { name: 'Ocena', content: grade.Grade },
    { name: 'Data', content: convertLibrusDate(grade.Date || grade.AddDate).toLocaleDateString('pl-PL') },
    { name: 'Dodano przez', content: grade.AddedBy.FirstName + ' ' + grade.AddedBy.LastName },
    { name: 'Kategoria', content: grade.Category.Name },
    { name: 'Komentarz', content: grade.Comments?.map(comment => comment.Text).join('\n\n') || null },
    { name: 'Waga', content: grade.Category.Weight },
    { name: 'Licz do średniej', content: grade.Kind === 'Grades' ? (grade.IsConstituent ? 'Tak' : 'Nie') : null },
  ];

  for (let property of propertyList) {
    if (!property.content) continue;
    let itemEl = document.createElement('li');
    itemEl.classList.value = 'ui details-item';
    itemEl.innerHTML = `
    <h5 class="ui details-item-name">${property.name}</h5>
    <p class="ui details-item-content">${property.content}</p>
    `;
    listEl.appendChild(itemEl);
  }

  return detailsContainerEl.innerHTML;
}

// <ul class="ui details-list">
//   <li class="ui details-item">
//     <h5 class="ui details-item-name">name</h5>
//     <p class="ui details-item-content">content</p>
//   </li>
// </ul>
