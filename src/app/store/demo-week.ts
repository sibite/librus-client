import { toDateString } from "../shared/date-utilities";
import { TimetableEntryType } from "./models/timetable.type";

const DEMO_WEEK: TimetableEntryType[][][] = [[
  [],
  [
    {
      Lesson: {
        Id: 606993,
        Url: '',
      },
      Classroom: {
        Id: 4700,
        Url: '',
        Name: '5',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '1',
      TimetableEntry: {
        Id: 719198,
        Url: '',
      },
      DayNo: '1',
      Subject: {
        Id: 53730,
        Name: 'język angielski',
        Short: 'ja',
        Url: '',
      },
      Teacher: {
        Id: 758322,
        FirstName: 'Mariola',
        LastName: 'Lis',
        Url: '',
      },
      IsSubstitutionClass: false,
      IsCanceled: false,
      SubstitutionNote: null,
      HourFrom: '08:00',
      HourTo: '08:45',
      VirtualClass: {
        Id: 687709,
        Url: '',
      },
      VirtualClassName: '3.7',
    },
  ],
  [
    {
      Lesson: {
        Id: 1484746,
        Url: '',
      },
      Classroom: {
        Id: 4691,
        Url: '',
        Name: '13',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '2',
      TimetableEntry: {
        Id: 719387,
        Url: '',
      },
      DayNo: '1',
      Subject: {
        Id: 53732,
        Name: 'język polski',
        Short: 'jp',
        Url: '',
      },
      Teacher: {
        Id: 718363,
        FirstName: 'Elżbieta',
        LastName: 'Błaszczyk',
        Url: '',
      },
      Class: { Id: 50486, Url: '' },
      IsSubstitutionClass: false,
      IsCanceled: false,
      SubstitutionNote: null,
      HourFrom: '08:50',
      HourTo: '09:35',
    },
  ],
  [
    {
      Lesson: {
        Id: 1571292,
        Url: '',
      },
      Classroom: {
        Id: 6156,
        Url: '',
        Name: '11',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '3',
      TimetableEntry: {
        Id: 719488,
        Url: '',
      },
      DayNo: '1',
      Subject: {
        Id: 53734,
        Name: 'matematyka',
        Short: 'm',
        Url: '',
      },
      Teacher: {
        Id: 901807,
        FirstName: 'Kinga',
        LastName: 'Krajewska',
        Url: '',
      },
      Class: { Id: 50486, Url: '' },
      IsSubstitutionClass: false,
      IsCanceled: false,
      SubstitutionNote: null,
      HourFrom: '09:40',
      HourTo: '10:25',
    },
  ],
  [
    {
      Lesson: {
        Id: 606919,
        Url: '',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '4',
      TimetableEntry: {
        Id: 719145,
        Url: '',
      },
      DayNo: '1',
      Subject: {
        Id: 53752,
        Name: 'wychowanie fizyczne',
        Short: 'wf',
        Url: '',
      },
      Teacher: {
        Id: 901801,
        FirstName: 'Patryk',
        LastName: 'Wrzeszczak',
        Url: '',
      },
      IsSubstitutionClass: false,
      IsCanceled: false,
      SubstitutionNote: null,
      HourFrom: '10:45',
      HourTo: '11:30',
      VirtualClass: {
        Id: 784876,
        Url: '',
      },
      VirtualClassName: '3E Chłopcy',
      Classroom: {},
    },
  ],
  [
    {
      Lesson: {
        Id: 1677213,
        Url: '',
      },
      Classroom: {
        Id: 6157,
        Url: '',
        Name: '15',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '5',
      TimetableEntry: {
        Id: 719576,
        Url: '',
      },
      DayNo: '1',
      Subject: {
        Id: 53723,
        Name: 'fizyka',
        Short: 'f',
        Url: '',
      },
      Teacher: {
        Id: 705622,
        FirstName: 'Piotr',
        LastName: 'Kubiak',
        Url: '',
      },
      Class: { Id: 50486, Url: '' },
      IsSubstitutionClass: false,
      IsCanceled: false,
      SubstitutionNote: null,
      HourFrom: '11:35',
      HourTo: '12:20',
    },
  ],
  [
    {
      Lesson: {
        Id: 1677213,
        Url: '',
      },
      Classroom: {
        Id: 4693,
        Url: '',
        Name: '16',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '6',
      TimetableEntry: {
        Id: 719578,
        Url: '',
      },
      DayNo: '1',
      Subject: {
        Id: 53723,
        Name: 'fizyka',
        Short: 'f',
        Url: '',
      },
      Teacher: {
        Id: 705622,
        FirstName: 'Piotr',
        LastName: 'Kubiak',
        Url: '',
      },
      Class: { Id: 50486, Url: '' },
      IsSubstitutionClass: false,
      IsCanceled: false,
      SubstitutionNote: null,
      HourFrom: '12:30',
      HourTo: '13:15',
    },
  ],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
],
 [
  [],
  [],
  [
    {
      Lesson: {
        Id: 1677211,
        Url: '',
      },
      Classroom: {
        Id: 4695,
        Url: '',
        Name: '22',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '2',
      TimetableEntry: {
        Id: 719547,
        Url: '',
      },
      DayNo: '2',
      Subject: {
        Id: 53728,
        Name: 'historia i społeczeństwo',
        Short: 'his',
        Url: '',
      },
      Teacher: {
        Id: 718355,
        FirstName: 'Joanna',
        LastName: 'Olszewska',
        Url: '',
      },
      Class: { Id: 50486, Url: '' },
      IsSubstitutionClass: false,
      IsCanceled: false,
      SubstitutionNote: null,
      HourFrom: '08:50',
      HourTo: '09:35',
    },
  ],
  [
    {
      Lesson: {
        Id: 1484746,
        Url: '',
      },
      Classroom: {
        Id: 4691,
        Url: '',
        Name: '13',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '3',
      TimetableEntry: {
        Id: 719388,
        Url: '',
      },
      DayNo: '2',
      Subject: {
        Id: 53732,
        Name: 'język polski',
        Short: 'jp',
        Url: '',
      },
      Teacher: {
        Id: 718363,
        FirstName: 'Elżbieta',
        LastName: 'Błaszczyk',
        Url: '',
      },
      Class: { Id: 50486, Url: '' },
      IsSubstitutionClass: false,
      IsCanceled: false,
      SubstitutionNote: null,
      HourFrom: '09:40',
      HourTo: '10:25',
    },
  ],
  [
    {
      Lesson: {
        Id: 1571292,
        Url: '',
      },
      Classroom: {
        Id: 6156,
        Url: '',
        Name: '11',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '4',
      TimetableEntry: {
        Id: 719484,
        Url: '',
      },
      DayNo: '2',
      Subject: {
        Id: 53734,
        Name: 'matematyka',
        Short: 'm',
        Url: '',
      },
      Teacher: {
        Id: 901807,
        FirstName: 'Kinga',
        LastName: 'Krajewska',
        Url: '',
      },
      Class: { Id: 50486, Url: '' },
      IsSubstitutionClass: false,
      IsCanceled: false,
      SubstitutionNote: null,
      HourFrom: '10:45',
      HourTo: '11:30',
    },
  ],
  [
    {
      Lesson: {
        Id: 1677213,
        Url: '',
      },
      Classroom: {
        Id: 4693,
        Url: '',
        Name: '16',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '5',
      TimetableEntry: {
        Id: 719577,
        Url: '',
      },
      DayNo: '2',
      Subject: {
        Id: 53723,
        Name: 'fizyka',
        Short: 'f',
        Url: '',
      },
      Teacher: {
        Id: 705622,
        FirstName: 'Piotr',
        LastName: 'Kubiak',
        Url: '',
      },
      Class: { Id: 50486, Url: '' },
      IsSubstitutionClass: false,
      IsCanceled: false,
      SubstitutionNote: null,
      HourFrom: '11:35',
      HourTo: '12:20',
    },
  ],
  [
    {
      Lesson: {
        Id: 1571292,
        Url: '',
      },
      Classroom: {
        Id: 6156,
        Url: '',
        Name: '11',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '6',
      TimetableEntry: {
        Id: 719483,
        Url: '',
      },
      DayNo: '2',
      Subject: {
        Id: 53734,
        Name: 'matematyka',
        Short: 'm',
        Url: '',
      },
      Teacher: {
        Id: 901807,
        FirstName: 'Kinga',
        LastName: 'Krajewska',
        Url: '',
      },
      Class: { Id: 50486, Url: '' },
      IsSubstitutionClass: false,
      IsCanceled: false,
      SubstitutionNote: null,
      HourFrom: '12:30',
      HourTo: '13:15',
    },
  ],
  [
    {
      Lesson: {
        Id: 1484746,
        Url: '',
      },
      Classroom: {
        Id: 4691,
        Url: '',
        Name: '13',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '7',
      TimetableEntry: {
        Id: 719390,
        Url: '',
      },
      DayNo: '2',
      Subject: {
        Id: 53732,
        Name: 'język polski',
        Short: 'jp',
        Url: '',
      },
      Teacher: {
        Id: 718363,
        FirstName: 'Elżbieta',
        LastName: 'Błaszczyk',
        Url: '',
      },
      Class: { Id: 50486, Url: '' },
      IsSubstitutionClass: false,
      IsCanceled: false,
      SubstitutionNote: null,
      HourFrom: '13:20',
      HourTo: '14:05',
    },
  ],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
],
 [
  [],
  [
    {
      Lesson: {
        Id: 1304675,
        Url: '',
      },
      Classroom: {
        Id: 4696,
        Url: '',
        Name: '25',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '1',
      TimetableEntry: {
        Id: 719232,
        Url: '',
      },
      DayNo: '3',
      Subject: {
        Id: 69956,
        Name: 'język francuski',
        Short: 'jf',
        Url: '',
      },
      Teacher: {
        Id: 901812,
        FirstName: 'Maria',
        LastName: 'Joźwik',
        Url: '',
      },
      IsSubstitutionClass: false,
      IsCanceled: true,
      SubstitutionNote: null,
      HourFrom: '08:00',
      HourTo: '08:45',
      VirtualClass: {
        Id: 687703,
        Url: '',
      },
      VirtualClassName: 'fr 3.8',
    },
  ],
  [
    {
      Lesson: {
        Id: 1304675,
        Url: '',
      },
      Classroom: {
        Id: 4696,
        Url: '',
        Name: '25',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '2',
      TimetableEntry: {
        Id: 719233,
        Url: '',
      },
      DayNo: '3',
      Subject: {
        Id: 69956,
        Name: 'język francuski',
        Short: 'jf',
        Url: '',
      },
      Teacher: {
        Id: 901812,
        FirstName: 'Maria',
        LastName: 'Joźwik',
        Url: '',
      },
      IsSubstitutionClass: false,
      IsCanceled: true,
      SubstitutionNote: null,
      HourFrom: '08:50',
      HourTo: '09:35',
      VirtualClass: {
        Id: 687703,
        Url: '',
      },
      VirtualClassName: 'fr 3.8',
    },
  ],
  [],
  [],
  [
    {
      Lesson: {
        Id: 1677211,
        Url: '',
      },
      OrgClassroom: {
        Id: 6156,
        Url: '',
        Name: '11',
      },
      DateFrom: '2022-04-27',
      DateTo: '2022-04-27',
      LessonNo: '5',
      TimetableEntry: {
        Id: 719485,
        Url: '',
      },
      DayNo: '3',
      Subject: {
        Id: 53728,
        Name: 'historia i społeczeństwo',
        Short: 'his',
        Url: '',
      },
      Teacher: {
        Id: 718355,
        FirstName: 'Joanna',
        LastName: 'Olszewska',
        Url: '',
      },
      Class: { Id: 50486, Url: '' },
      IsSubstitutionClass: true,
      IsCanceled: false,
      SubstitutionNote: null,
      OrgDate: '2022-04-27',
      OrgLessonNo: '5',
      OrgLesson: {
        Id: 1571292,
        Url: '',
      },
      OrgSubject: {
        Id: 53734,
        Url: '',
        Name: 'matematyka',
      },
      OrgTeacher: {
        Id: 901807,
        Url: '',
        FirstName: 'Kinga',
        LastName: 'Krajewska',
      },
      OrgHourFrom: '11:35',
      OrgHourTo: '12:20',
      HourFrom: '11:35',
      HourTo: '12:20',
      SubstitutionClassUrl: '',
      Classroom: {},
    },
  ],
  [
    {
      Lesson: {
        Id: 1571292,
        Url: '',
      },
      Classroom: {
        Id: 6156,
        Url: '',
        Name: '11',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '6',
      TimetableEntry: {
        Id: 719487,
        Url: '',
      },
      DayNo: '3',
      Subject: {
        Id: 53734,
        Name: 'matematyka',
        Short: 'm',
        Url: '',
      },
      Teacher: {
        Id: 901807,
        FirstName: 'Kinga',
        LastName: 'Krajewska',
        Url: '',
      },
      Class: { Id: 50486, Url: '' },
      IsSubstitutionClass: false,
      IsCanceled: true,
      SubstitutionNote: null,
      HourFrom: '12:30',
      HourTo: '13:15',
    },
  ],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
],
 [
  [],
  [
    {
      Lesson: {
        Id: 1304594,
        Url: '',
      },
      Classroom: {
        Id: 6158,
        Url: '',
        Name: '24',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '1',
      TimetableEntry: {
        Id: 719176,
        Url: '',
      },
      DayNo: '4',
      Subject: {
        Id: 69952,
        Name: 'algorytmika i programowanie',
        Short: 'aip',
        Url: '',
      },
      Teacher: {
        Id: 901804,
        FirstName: 'Jarosław',
        LastName: 'Makowski',
        Url: '',
      },
      IsSubstitutionClass: false,
      IsCanceled: false,
      SubstitutionNote: null,
      HourFrom: '08:00',
      HourTo: '08:45',
      VirtualClass: {
        Id: 763474,
        Url: '',
      },
      VirtualClassName: '3i 2Grupa',
    },
  ],
  [
    {
      Lesson: {
        Id: 1484763,
        Url: '',
      },
      Classroom: {
        Id: 4693,
        Url: '',
        Name: '16',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '2',
      TimetableEntry: {
        Id: 719466,
        Url: '',
      },
      DayNo: '4',
      Subject: {
        Id: 53726,
        Name: 'godzina wychowawcza',
        Short: 'gw',
        Url: '',
      },
      Teacher: {
        Id: 901804,
        FirstName: 'Jarosław',
        LastName: 'Makowski',
        Url: '',
      },
      Class: { Id: 50486, Url: '' },
      IsSubstitutionClass: false,
      IsCanceled: false,
      SubstitutionNote: null,
      HourFrom: '08:50',
      HourTo: '09:35',
    },
  ],
  [
    {
      Lesson: {
        Id: 606919,
        Url: '',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '3',
      TimetableEntry: {
        Id: 719144,
        Url: '',
      },
      DayNo: '4',
      Subject: {
        Id: 53752,
        Name: 'wychowanie fizyczne',
        Short: 'wf',
        Url: '',
      },
      Teacher: {
        Id: 901801,
        FirstName: 'Patryk',
        LastName: 'Wrzeszczak',
        Url: '',
      },
      IsSubstitutionClass: false,
      IsCanceled: false,
      SubstitutionNote: null,
      HourFrom: '09:40',
      HourTo: '10:25',
      VirtualClass: {
        Id: 784876,
        Url: '',
      },
      VirtualClassName: '3E Chłopcy',
      Classroom: {},
    },
  ],
  [
    {
      Lesson: {
        Id: 606919,
        Url: '',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '4',
      TimetableEntry: {
        Id: 719143,
        Url: '',
      },
      DayNo: '4',
      Subject: {
        Id: 53752,
        Name: 'wychowanie fizyczne',
        Short: 'wf',
        Url: '',
      },
      Teacher: {
        Id: 901801,
        FirstName: 'Patryk',
        LastName: 'Wrzeszczak',
        Url: '',
      },
      IsSubstitutionClass: false,
      IsCanceled: false,
      SubstitutionNote: null,
      HourFrom: '10:45',
      HourTo: '11:30',
      VirtualClass: {
        Id: 784876,
        Url: '',
      },
      VirtualClassName: '3E Chłopcy',
      Classroom: {},
    },
  ],
  [
    {
      Lesson: {
        Id: 1571292,
        Url: '',
      },
      Classroom: {
        Id: 6156,
        Url: '',
        Name: '11',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '5',
      TimetableEntry: {
        Id: 719486,
        Url: '',
      },
      DayNo: '4',
      Subject: {
        Id: 53734,
        Name: 'matematyka',
        Short: 'm',
        Url: '',
      },
      Teacher: {
        Id: 901807,
        FirstName: 'Kinga',
        LastName: 'Krajewska',
        Url: '',
      },
      Class: { Id: 50486, Url: '' },
      IsSubstitutionClass: false,
      IsCanceled: false,
      SubstitutionNote: null,
      HourFrom: '11:35',
      HourTo: '12:20',
    },
  ],
  [
    {
      Lesson: {
        Id: 606993,
        Url: '',
      },
      Classroom: {
        Id: 4700,
        Url: '',
        Name: '5',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '6',
      TimetableEntry: {
        Id: 719197,
        Url: '',
      },
      DayNo: '4',
      Subject: {
        Id: 53730,
        Name: 'język angielski',
        Short: 'ja',
        Url: '',
      },
      Teacher: {
        Id: 758322,
        FirstName: 'Mariola',
        LastName: 'Lis',
        Url: '',
      },
      IsSubstitutionClass: false,
      IsCanceled: false,
      SubstitutionNote: null,
      HourFrom: '12:30',
      HourTo: '13:15',
      VirtualClass: {
        Id: 687709,
        Url: '',
      },
      VirtualClassName: '3.7',
    },
  ],
  [
    {
      Lesson: {
        Id: 606993,
        Url: '',
      },
      Classroom: {
        Id: 4700,
        Url: '',
        Name: '5',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '7',
      TimetableEntry: {
        Id: 719196,
        Url: '',
      },
      DayNo: '4',
      Subject: {
        Id: 53730,
        Name: 'język angielski',
        Short: 'ja',
        Url: '',
      },
      Teacher: {
        Id: 758322,
        FirstName: 'Mariola',
        LastName: 'Lis',
        Url: '',
      },
      IsSubstitutionClass: false,
      IsCanceled: false,
      SubstitutionNote: null,
      HourFrom: '13:20',
      HourTo: '14:05',
      VirtualClass: {
        Id: 687709,
        Url: '',
      },
      VirtualClassName: '3.7',
    },
  ],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
],
 [
  [],
  [],
  [],
  [],
  [
    {
      Lesson: {
        Id: 1677211,
        Url: '',
      },
      Classroom: {
        Id: 4695,
        Url: '',
        Name: '22',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '4',
      TimetableEntry: {
        Id: 719548,
        Url: '',
      },
      DayNo: '5',
      Subject: {
        Id: 53728,
        Name: 'historia i społeczeństwo',
        Short: 'his',
        Url: '',
      },
      Teacher: {
        Id: 718355,
        FirstName: 'Joanna',
        LastName: 'Olszewska',
        Url: '',
      },
      Class: { Id: 50486, Url: '' },
      IsSubstitutionClass: false,
      IsCanceled: false,
      SubstitutionNote: null,
      HourFrom: '10:45',
      HourTo: '11:30',
    },
  ],
  [
    {
      Lesson: {
        Id: 1484746,
        Url: '',
      },
      Classroom: {
        Id: 4691,
        Url: '',
        Name: '13',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '5',
      TimetableEntry: {
        Id: 719389,
        Url: '',
      },
      DayNo: '5',
      Subject: {
        Id: 53732,
        Name: 'język polski',
        Short: 'jp',
        Url: '',
      },
      Teacher: {
        Id: 718363,
        FirstName: 'Elżbieta',
        LastName: 'Błaszczyk',
        Url: '',
      },
      Class: { Id: 50486, Url: '' },
      IsSubstitutionClass: false,
      IsCanceled: false,
      SubstitutionNote: null,
      HourFrom: '11:35',
      HourTo: '12:20',
    },
  ],
  [
    {
      Lesson: {
        Id: 1304595,
        Url: '',
      },
      Classroom: {
        Id: 6158,
        Url: '',
        Name: '24',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '6',
      TimetableEntry: {
        Id: 719174,
        Url: '',
      },
      DayNo: '5',
      Subject: {
        Id: 69953,
        Name: 'elementy grafiki komputerowej',
        Short: 'egk',
        Url: '',
      },
      Teacher: {
        Id: 901804,
        FirstName: 'Jarosław',
        LastName: 'Makowski',
        Url: '',
      },
      IsSubstitutionClass: false,
      IsCanceled: false,
      SubstitutionNote: null,
      HourFrom: '12:30',
      HourTo: '13:15',
      VirtualClass: {
        Id: 803099,
        Url: '',
      },
      VirtualClassName: '3p 2. Grupa',
    },
  ],
  [
    {
      Lesson: {
        Id: 1304595,
        Url: '',
      },
      Classroom: {
        Id: 6158,
        Url: '',
        Name: '24',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '7',
      TimetableEntry: {
        Id: 719175,
        Url: '',
      },
      DayNo: '5',
      Subject: {
        Id: 69953,
        Name: 'elementy grafiki komputerowej',
        Short: 'egk',
        Url: '',
      },
      Teacher: {
        Id: 901804,
        FirstName: 'Jarosław',
        LastName: 'Makowski',
        Url: '',
      },
      IsSubstitutionClass: false,
      IsCanceled: false,
      SubstitutionNote: null,
      HourFrom: '13:20',
      HourTo: '14:05',
      VirtualClass: {
        Id: 803099,
        Url: '',
      },
      VirtualClassName: '3p 2. Grupa',
    },
  ],
  [
    {
      Lesson: {
        Id: 606993,
        Url: '',
      },
      Classroom: {
        Id: 4700,
        Url: '',
        Name: '5',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '8',
      TimetableEntry: {
        Id: 719199,
        Url: '',
      },
      DayNo: '5',
      Subject: {
        Id: 53730,
        Name: 'język angielski',
        Short: 'ja',
        Url: '',
      },
      Teacher: {
        Id: 758322,
        FirstName: 'Mariola',
        LastName: 'Lis',
        Url: '',
      },
      IsSubstitutionClass: false,
      IsCanceled: false,
      SubstitutionNote: null,
      HourFrom: '14:10',
      HourTo: '14:55',
      VirtualClass: {
        Id: 687709,
        Url: '',
      },
      VirtualClassName: '3.7',
    },
  ],
  [
    {
      Lesson: {
        Id: 606993,
        Url: '',
      },
      Classroom: {
        Id: 4700,
        Url: '',
        Name: '5',
      },
      DateFrom: '2022-01-31',
      DateTo: '2022-06-24',
      LessonNo: '9',
      TimetableEntry: {
        Id: 719200,
        Url: '',
      },
      DayNo: '5',
      Subject: {
        Id: 53730,
        Name: 'język angielski',
        Short: 'ja',
        Url: '',
      },
      Teacher: {
        Id: 758322,
        FirstName: 'Mariola',
        LastName: 'Lis',
        Url: '',
      },
      IsSubstitutionClass: false,
      IsCanceled: false,
      SubstitutionNote: null,
      HourFrom: '15:00',
      HourTo: '15:45',
      VirtualClass: {
        Id: 687709,
        Url: '',
      },
      VirtualClassName: '3.7',
    },
  ],
  [],
  [],
  [],
  [],
  [],
],
 [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
 [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []]
];

const day = 24 * 60 * 60e3;

 export default function getDemoWeek(weekStart: Date) {
  const timetableWeek: {[key: string]: TimetableEntryType[][]} = {};

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart.getTime() + day * i);
    const dateString = toDateString(date);
    timetableWeek[dateString] = DEMO_WEEK[i];
  }

  return timetableWeek;
 };
