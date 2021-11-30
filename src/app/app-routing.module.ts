import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AttendancesDayDetailsComponent } from './diary/attendances/attendances-day-details/attendances-day-details.component';
import { AttendancesComponent } from './diary/attendances/attendances.component';
import { DiaryComponent } from './diary/diary.component';
import { GradeSubjectDetailsComponent } from './diary/grades/grade-subject-details/grade-subject-details.component';
import { GradesComponent } from './diary/grades/grades.component';

const routes: Routes = [
  { path: '', redirectTo: 'main/grades', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent, data: { title: 'Logowanie' } },
  { path: 'grades/subject/:id', component: GradeSubjectDetailsComponent },
  { path: 'attendances/day/:day', component: AttendancesDayDetailsComponent },
  {
    path: 'main',
    component: DiaryComponent,
    data: { title: 'Dziennik' },
    children: [
      { path: 'grades', component: GradesComponent, pathMatch: 'full', data: { title: 'Oceny i zachowanie' } },
      { path: 'attendances', component: AttendancesComponent, pathMatch: 'full', data: { title: 'Frekwencja' } }
    ]
  },
  { path: '**', redirectTo: 'main/grades' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
