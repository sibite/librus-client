import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { AttendancesDayDetailsComponent } from './diary/attendances/attendances-day-details/attendances-day-details.component';
import { AttendancesComponent } from './diary/attendances/attendances.component';
import { DiaryComponent } from './diary/diary.component';
import { DiaryGuard } from './diary/diary.guard';
import { GradeSubjectDetailsComponent } from './diary/grades/grade-subject-details/grade-subject-details.component';
import { GradesComponent } from './diary/grades/grades.component';
import { PlanComponent } from './diary/plan/plan.component';

const routes: Routes = [
  { path: '', redirectTo: 'main/grades', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent, canActivate: [AuthGuard],  data: { title: 'Logowanie' } },
  { path: 'grades/subject/:id', component: GradeSubjectDetailsComponent, canActivate: [DiaryGuard] },
  { path: 'attendances/day/:day', component: AttendancesDayDetailsComponent, canActivate: [DiaryGuard] },
  {
    path: 'main',
    component: DiaryComponent,
    canActivate: [DiaryGuard],
    data: { title: 'Dziennik' },
    children: [
      { path: 'grades', component: GradesComponent, data: { title: 'Oceny i zachowanie' } },
      { path: 'attendances', component: AttendancesComponent, data: { title: 'Frekwencja' } },
      { path: 'timetables', component: PlanComponent, data: { title: 'Plan lekcji' } },
      { path: '**', redirectTo: 'grades' }
    ]
  },
  { path: '**', redirectTo: 'main/grades' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
