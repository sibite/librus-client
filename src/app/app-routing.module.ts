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
import { MySchoolComponent } from './diary/my-school/my-school.component';
import { OverviewComponent } from './diary/overview/overview.component';
import { PlanComponent } from './diary/plan/plan.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: 'main/overview', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent, canActivate: [AuthGuard],  data: { title: 'Logowanie', animation: 0 } },
  { path: 'settings', component: SettingsComponent, data: { title: 'Ustawienia', animation: 20 } },
  { path: 'grades/subject/:id', component: GradeSubjectDetailsComponent, canActivate: [DiaryGuard], data: { animation: 11 } },
  { path: 'attendances/day/:day', component: AttendancesDayDetailsComponent, canActivate: [DiaryGuard], data: { animation: 12 } },
  {
    path: 'main',
    component: DiaryComponent,
    canActivate: [DiaryGuard],
    data: { title: 'Dziennik', animation: 10 },
    children: [
      { path: 'overview', component: OverviewComponent, data: { title: 'Przegląd', animation: 0 } },
      { path: 'grades', component: GradesComponent, data: { title: 'Oceny i zachowanie', animation: 1 } },
      { path: 'attendances', component: AttendancesComponent, data: { title: 'Frekwencja', animation: 2 } },
      { path: 'timetables', component: PlanComponent, data: { title: 'Plan lekcji', animation: 3 } },
      { path: 'my-school', component: MySchoolComponent, data: { title: 'Szkoła i klasa', animation: 4 } },
      { path: '**', redirectTo: 'grades' }
    ]
  },
  { path: '**', redirectTo: 'main/overview' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
