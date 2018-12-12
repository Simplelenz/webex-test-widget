import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';


import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { UtilService } from './services/util.service';
import { HttpClientModule } from '@angular/common/http';

const appRoutes: Routes = [
];
@NgModule({
  declarations: [
    AppComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, {}),
  ],
  providers: [
    // {provide: LocationStrategy, useClass: HashLocationStrategy}
    UtilService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
