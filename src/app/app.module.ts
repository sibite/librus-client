import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { DiaryComponent } from './diary/diary.component';
import { GradeSubjectItemComponent } from './diary/grades/grade-subject-item/grade-subject-item.component';
import { GradeSubjectDetailsComponent } from './diary/grades/grade-subject-details/grade-subject-details.component';
import { GradesComponent } from './diary/grades/grades.component';
import { AppHammerConfig } from './hammer.config';
import { AuthInterceptorService } from './interceptors/auth-interceptor.service';
import { CorsInterceptorService } from './interceptors/cors-interceptor.service';
import { NavBarItemComponent } from './shared/nav-bar/nav-bar-item/nav-bar-item.component';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';
import { ClickEffectDirective } from './shared/click-effect.directive';
import { CapitalizePipe } from './shared/pipes/capitalize.pipe';
import { KeepHtmlPipe } from './shared/pipes/keep-html.pipe';
import { PopUpComponent } from './shared/pop-up/pop-up.component';
import { SideMenuOpenerDirective } from './shared/side-menu-opener.directive';
import { SideMenuItemComponent } from './shared/side-menu/side-menu-item/side-menu-item.component';
import { SideMenuComponent } from './shared/side-menu/side-menu.component';
import { TopbarComponent } from './shared/top-bar/top-bar.component';
import { DropdownComponent } from './shared/dropdown/dropdown.component';
import { BarSwitchComponent } from './shared/bar-switch/bar-switch.component';
import { KeysPipe } from './shared/pipes/keys.pipe';
import { AttendancesComponent } from './diary/attendances/attendances.component';
import { AttendancesDayItemComponent } from './diary/attendances/attendances-day-item/attendances-day-item.component';
import { AttendancesDayDetailsComponent } from './diary/attendances/attendances-day-details/attendances-day-details.component';
import { PlanComponent } from './diary/plan/plan.component';
import { LessonsListComponent } from './diary/plan/lessons-list/lessons-list.component';
import { TimerangePipe } from './shared/pipes/timerange.pipe';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { DiaryGuard } from './diary/diary.guard';
import { AuthGuard } from './auth/auth.guard';
import { RefreshGestureDirective } from './shared/refresh-gesture.directive';
import { MySchoolComponent } from './diary/my-school/my-school.component';
import { OverviewComponent } from './diary/overview/overview.component';
import { GradeComponent } from './diary/grades/grade-subject-details/grade/grade.component';
import { LessonComponent } from './diary/plan/lessons-list/lesson/lesson.component';
import { HomeworkComponent } from './diary/plan/lessons-list/homework/homework.component';
import { EventComponent } from './diary/plan/lessons-list/event/event.component';
import { AttendanceComponent } from './diary/attendances/attendances-day-details/attendance/attendance.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SettingsComponent } from './settings/settings.component';


@NgModule({
  declarations: [
    ClickEffectDirective,
    SideMenuOpenerDirective,
    RefreshGestureDirective,
    AppComponent,
    AuthComponent,
    TopbarComponent,
    SideMenuComponent,
    SideMenuItemComponent,
    DiaryComponent,
    NavBarComponent,
    NavBarItemComponent,
    GradesComponent,
    GradeSubjectItemComponent,
    GradeSubjectDetailsComponent,
    PopUpComponent,
    DropdownComponent,
    BarSwitchComponent,
    AttendancesComponent,
    AttendancesDayItemComponent,
    AttendancesDayDetailsComponent,
    PlanComponent,
    LessonsListComponent,
    CapitalizePipe,
    KeepHtmlPipe,
    KeysPipe,
    TimerangePipe,
    MySchoolComponent,
    OverviewComponent,
    GradeComponent,
    LessonComponent,
    HomeworkComponent,
    EventComponent,
    AttendanceComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    HammerModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    CapitalizePipe,
    DiaryGuard,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CorsInterceptorService,
      multi: true
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: AppHammerConfig,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
