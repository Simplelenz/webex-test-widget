import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HttpService } from './services/http.service';
import { LoginService } from './services/login.service';
import { UtilService } from './services/util.service';
import { HttpModule } from '@angular/http';
import { ConfigService } from './services/config.service';



const appRoutes: Routes = [
];
@NgModule({
  declarations: [
    AppComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(appRoutes, {}),
  ],
  providers: [
    // {provide: LocationStrategy, useClass: HashLocationStrategy}
    UtilService,
    LoginService,
    HttpService,
    ConfigService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
