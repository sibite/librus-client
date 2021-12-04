import { convertLibrusDate, formatDate } from "src/app/shared/date-utilities";
import { generateDetailsListHTML } from "src/app/shared/generate-details-list";
import { CapitalizePipe } from "src/app/shared/pipes/capitalize.pipe";
import { TimerangePipe } from "src/app/shared/pipes/timerange.pipe";
import { AnyCalendarEntryType } from "src/app/store/models/calendar.type";

export const eventKindNames = {
  'TeacherFreeDays': 'Nieobecność nauczyciela',
  'ClassFreeDays': 'Nieobecność klasy',
  'SchoolFreeDays': 'Dodatkowy dzień wolny',
  'ParentTeacherConferences': 'Spotkanie z rodzicami'
}

function reFormatDate(date: string) {
  return formatDate(convertLibrusDate(date));
}

export function getEventDetailsHTML(event: AnyCalendarEntryType) {

  let date = null;
  if (event.Date) {
    date = reFormatDate(event.Date);
  }
  else if (event.DateFrom) {
    date = event.DateFrom == event.DateTo
      ? reFormatDate(event.DateFrom)
      : `${reFormatDate(event.DateFrom)} \u2013 ${reFormatDate(event.DateTo)}`;
  }

  let properties = [
    { name: 'Nazwa', content: event.Name || eventKindNames[event.Kind] },
    { name: 'Kategoria', content: event.Category?.Name },
    { name: 'Opis', content: CapitalizePipe.prototype.transform(event.Content) },
    { name: 'Temat', content: event.Topic },
    { name: 'Przedmiot', content: CapitalizePipe.prototype.transform(event.Subject?.Name) },
    { name: 'Dodano przez', content: event.CreatedBy?.FirstName ? event.CreatedBy?.FirstName + ' ' + event.CreatedBy?.LastName : null },
    { name: 'Nauczyciel', content: event.Teacher?.FirstName ? event.Teacher?.FirstName + ' ' + event.Teacher?.LastName : null },
    { name: 'Data', content: date },
    { name: event.Time ? 'Godzina' : 'Godziny', content: TimerangePipe.prototype.transform( event, null ) || event.Time?.substr(0, 5) },
    { name: 'Sala', content: event.Room },
    { name: 'Numer lekcji', content: event.LessonNo },
  ]

  return generateDetailsListHTML(properties);
}
