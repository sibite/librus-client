import { convertLibrusDate, formatDate } from "src/app/shared/date-utilities";
import { generateDetailsListHTML } from "src/app/shared/generate-details-list";
import { CapitalizePipe } from "src/app/shared/pipes/capitalize.pipe";
import { TimetableEntryType } from "src/app/store/models/timetable.type";

function reFormatDate(date: string) {
  return formatDate(convertLibrusDate(date));
}

export function getLessonDetailsHTML(lesson: TimetableEntryType) {

  let teacher = null;
  if (!lesson.OrgTeacher) {
    teacher = lesson.Teacher.FirstName + ' ' + lesson.Teacher.LastName;
  } else {
    teacher = `${lesson.OrgTeacher.FirstName} ${lesson.OrgTeacher.LastName} <i class="bi-arrow-right"></i> ${lesson.Teacher.FirstName} ${lesson.Teacher.LastName}`;
  }

  let subject = null;
  if (!lesson.OrgSubject) {
    subject = CapitalizePipe.prototype.transform(lesson.Subject.Name);
  } else {
    subject = `${CapitalizePipe.prototype.transform(lesson.OrgSubject.Name)} <i class="bi-arrow-right"></i> ${CapitalizePipe.prototype.transform(lesson.Subject.Name)}`;
  }

  let lessonNo = null;
  if (!lesson.OrgLessonNo || lesson.LessonNo == lesson.OrgLessonNo) {
    lessonNo = lesson.LessonNo;
  } else {
    lessonNo = `${lesson.OrgLessonNo} <i class="bi-arrow-right"></i> ${lesson.LessonNo}`;
  }

  let classroom = null;
  if (!lesson.OrgClassroom || lesson.OrgClassroom.Name == lesson.Classroom.Name) {
    classroom = lesson.Classroom.Name;
  } else {
    classroom = `${lesson.OrgClassroom.Name} <i class="bi-arrow-right"></i> ${lesson.Classroom.Name || 'Brak'}`;
  }

  let properties = [
    { name: 'Przedmiot', content: subject },
    { name: 'Nauczyciel', content: teacher },
    { name: 'Sala', content: classroom },
    { name: 'Numer lekcji', content: lessonNo },
    { name: 'Data', content: reFormatDate(lesson.DateFrom) },
  ]

  return generateDetailsListHTML(properties);
}
