import { convertLibrusDate, formatDate } from "src/app/shared/date-utilities";
import { generateDetailsListHTML } from "src/app/shared/generate-details-list";
import { ClassInfoType } from "src/app/store/models/class-info.type";
import { SchoolInfoType } from "src/app/store/models/school-info.type";

export function getClassDetailsHTML(class_: ClassInfoType) {

  let properties = [
    { name: 'Numer', content: class_.Number + class_.Symbol },
    { name: 'Wychowawca', content: class_.ClassTutor?.FirstName ? `${class_.ClassTutor.FirstName} ${class_.ClassTutor.LastName}` : null },
    { name: 'Koniec semestru', content: formatDate(convertLibrusDate(class_.EndFirstSemester), 'normal') },
  ];

  return generateDetailsListHTML(properties);
}

export function getSchoolDetailsHTML(school: SchoolInfoType) {

  let properties = [
    { name: 'Nazwa', content: school.Name },
    { name: 'Dyrektor', content: school.NameHeadTeacher ? `${school.NameHeadTeacher} ${school.SurnameHeadTeacher}` : null },
    { name: 'Adres', content: `${school.State}\n${school.PostCode}, ${school.Town}\n${school.Street} ${school.BuildingNumber}` },
  ];

  return generateDetailsListHTML(properties);
}
