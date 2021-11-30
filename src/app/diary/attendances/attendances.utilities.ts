import { AttendanceType } from "src/app/store/models/attendance.type";

export function attendancesByLessonSorter(a: AttendanceType, b: AttendanceType) {
  return a.LessonNo - b.LessonNo
}
