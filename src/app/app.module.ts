import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';


import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { UtilService } from './services/util.service';
import { HttpClientModule } from '@angular/common/http';
import { ContactComponent } from './components/contact/contact.component';
import { ConversationPanelComponent } from './components/conversation-panel/conversation-panel.component';
import { ContactPanelComponent } from './components/contact-panel/contact-panel.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { PanelContainerComponent } from './components/panel-container/panel-container.component';
import { ConversationNamePopupComponent } from './components/conversation-name-popup/conversation-name-popup.component';
import { MessagePanelComponent } from './components/message-panel/message-panel.component';
import { VideoPanelComponent } from './components/video-panel/video-panel.component';
import { AudioPanelComponent } from './components/audio-panel/audio-panel.component';
import { IconComponent } from './components/icon/icon.component';
import {MockService} from "./services/mock.service";
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { FrontierOpenerComponent } from './components/frontier-opener/frontier-opener.component';
import { FrontierWidgetComponent } from './components/frontier-widget/frontier-widget.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule } from '@angular/forms';

const appRoutes: Routes = [
];
@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    ContactComponent,
    ConversationPanelComponent,
    ContactPanelComponent,
    SearchBarComponent,
    PanelContainerComponent,
    ConversationNamePopupComponent,
    MessagePanelComponent,
    VideoPanelComponent,
    AudioPanelComponent,
    IconComponent,
    NavigationBarComponent,
    FrontierOpenerComponent,
    FrontierWidgetComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    FormsModule,
    RouterModule.forRoot(appRoutes, {}),
  ],
  providers: [
    // {provide: LocationStrategy, useClass: HashLocationStrategy}
    UtilService,
    MockService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
