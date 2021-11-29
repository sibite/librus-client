import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DiaryComponent } from './diary/diary.component';
import { GradeSubjectComponent } from './diary/grades/grade-subject/grade-subject.component';
import { GradesComponent } from './diary/grades/grades.component';

const routes: Routes = [
  { path: '', redirectTo: 'main/grades', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent, data: { title: 'Logowanie' } },
  { path: 'grades/subject/:id', component: GradeSubjectComponent },
  {
    path: 'main',
    component: DiaryComponent,
    data: { title: 'Dziennik' },
    children: [
      { path: 'grades', component: GradesComponent, pathMatch: 'full', data: { title: 'Oceny i zachowanie' } }
    ]
  },
  { path: '**', redirectTo: 'main/grades' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
