import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { AttendanceComponent } from './diary/attendances/attendances-day-details/attendance/attendance.component';
import { AttendancesDayDetailsComponent } from './diary/attendances/attendances-day-details/attendances-day-details.component';
import { AttendancesDayItemComponent } from './diary/attendances/attendances-day-item/attendances-day-item.component';
import { AttendancesComponent } from './diary/attendances/attendances.component';
import { DiaryComponent } from './diary/diary.component';
import { DiaryGuard } from './diary/diary.guard';
import { GradeSubjectDetailsComponent } from './diary/grades/grade-subject-details/grade-subject-details.component';
import { GradeComponent } from './diary/grades/grade-subject-details/grade/grade.component';
import { GradeSubjectItemComponent } from './diary/grades/grade-subject-item/grade-subject-item.component';
import { GradesComponent } from './diary/grades/grades.component';
import { MySchoolComponent } from './diary/my-school/my-school.component';
import { OverviewComponent } from './diary/overview/overview.component';
import { EventComponent } from './diary/plan/lessons-list/event/event.component';
import { HomeworkComponent } from './diary/plan/lessons-list/homework/homework.component';
import { LessonComponent } from './diary/plan/lessons-list/lesson/lesson.component';
import { LessonsListComponent } from './diary/plan/lessons-list/lessons-list.component';
import { PlanComponent } from './diary/plan/plan.component';
import { AppHammerConfig } from './hammer.config';
import { AuthInterceptorService } from './interceptors/auth-interceptor.service';
import { CorsInterceptorService } from './interceptors/cors-interceptor.service';
import { SettingsComponent } from './settings/settings.component';
import { BarSwitchComponent } from './shared/bar-switch/bar-switch.component';
import { ClickEffectDirective } from './shared/click-effect.directive';
import { DropdownComponent } from './shared/dropdown/dropdown.component';
import { NavBarItemComponent } from './shared/nav-bar/nav-bar-item/nav-bar-item.component';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';
import { CapitalizePipe } from './shared/pipes/capitalize.pipe';
import { KeepHtmlPipe } from './shared/pipes/keep-html.pipe';
import { KeysPipe } from './shared/pipes/keys.pipe';
import { TimerangePipe } from './shared/pipes/timerange.pipe';
import { PopUpComponent } from './shared/pop-up/pop-up.component';
import { RefreshGestureDirective } from './shared/refresh-gesture.directive';
import { SideMenuOpenerDirective } from './shared/side-menu-opener.directive';
import { SideMenuItemComponent } from './shared/side-menu/side-menu-item/side-menu-item.component';
import { SideMenuComponent } from './shared/side-menu/side-menu.component';
import { TopbarComponent } from './shared/top-bar/top-bar.component';


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
    BrowserAnimationsModule,
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
      registrationStrategy: 'registerWhenStable:5000'
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
