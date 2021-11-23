import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DiaryComponent } from './diary/diary.component';
import { GradeSubjectComponent } from './diary/grades/grade-subject/grade-subject.component';
import { GradesComponent } from './diary/grades/grades.component';

const routes: Routes = [
  { path: '', redirectTo: 'diary', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent, data: { title: 'Logowanie' } },
  {
    path: 'diary',
    component: DiaryComponent,
    data: { title: 'Dziennik' },
    children: [
      { path: 'grades', component: GradesComponent, data: { title: 'Oceny i zachowanie' } }
    ]
  },
  { path: 'grades/list/:id', component: GradeSubjectComponent },
  { path: '**', redirectTo: 'diary/grades/list' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
