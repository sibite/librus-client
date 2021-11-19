import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CorsInterceptorService } from './interceptors/cors-interceptor.service';
import { AuthInterceptorService } from './interceptors/auth-interceptor.service';
import { AuthComponent } from './auth/auth.component';
import { ClickEffectDirective } from './shared/click-effect.directive';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ClickEffectDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
