import { convertLibrusDate } from "src/app/shared/date-converter";
import { generateDetailsListHTML } from "src/app/shared/generate-details-list";
import { CapitalizePipe } from "src/app/shared/pipes/capitalize.pipe";
import { AttendanceType } from "src/app/store/models/attendance.type";

export function getAttendanceDetailsHTML(attendance: AttendanceType) {
  let properties = [
    { name: 'Typ', content: attendance.Type.Name },
    { name: 'Numer lekcji', content: attendance.LessonNo },
    { name: 'Lekcja', content: CapitalizePipe.prototype.transform(attendance.Lesson?.Subject?.Name) },
    { name: 'Data', content: convertLibrusDate(attendance.Date || attendance.AddDate).toLocaleDateString('pl-PL') },
    { name: 'Dodano przez', content: attendance.AddedBy?.FirstName + ' ' + attendance.AddedBy?.LastName },
  ];

  return generateDetailsListHTML(properties);
}
