import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CorsInterceptorService } from './interceptors/cors-interceptor.service';
import { AuthInterceptorService } from './interceptors/auth-interceptor.service';
import { AuthComponent } from './auth/auth.component';
import { ClickEffectDirective } from './shared/click-effect.directive';
import { FormsModule } from '@angular/forms';
import { TopbarComponent } from './top-bar/top-bar.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { SideMenuOpenerDirective } from './shared/side-menu-opener.directive';
import { SideMenuItemComponent } from './side-menu/side-menu-item/side-menu-item.component';
import { AppHammerConfig } from './hammer.config';
import { DiaryComponent } from './diary/diary.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NavBarItemComponent } from './nav-bar/nav-bar-item/nav-bar-item.component';
import { GradesComponent } from './diary/grades/grades.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ClickEffectDirective,
    TopbarComponent,
    SideMenuComponent,
    SideMenuOpenerDirective,
    SideMenuItemComponent,
    DiaryComponent,
    NavBarComponent,
    NavBarItemComponent,
    GradesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    HammerModule
  ],
  providers: [
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
