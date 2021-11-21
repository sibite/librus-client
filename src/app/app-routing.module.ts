import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DiaryComponent } from './diary/diary.component';

const routes: Routes = [
  { path: '', redirectTo: 'diary', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'diary', component: DiaryComponent },
  { path: '**', redirectTo: 'auth'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
