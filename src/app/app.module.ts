import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { AudioPanelComponent } from './components/audio-panel/audio-panel.component';
import { ContactPanelComponent } from './components/contact-panel/contact-panel.component';
import { ContactComponent } from './components/contact/contact.component';
import { ConversationNamePopupComponent } from './components/conversation-name-popup/conversation-name-popup.component';
import { ConversationPanelComponent } from './components/conversation-panel/conversation-panel.component';
import { FrontierOpenerComponent } from './components/frontier-opener/frontier-opener.component';
import { FrontierWidgetComponent } from './components/frontier-widget/frontier-widget.component';
import { IconComponent } from './components/icon/icon.component';
import { MessagePanelComponent } from './components/message-panel/message-panel.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { PanelContainerComponent } from './components/panel-container/panel-container.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { VideoPanelComponent } from './components/video-panel/video-panel.component';
import { ConfigService } from './services/config.service';
import { HttpService } from './services/http.service';
import { LoginService } from './services/login.service';
import { MockService } from './services/mock.service';
import { UtilService } from './services/util.service';
import { SendReceiveMessagesComponent } from './components/send-receive-messages/send-receive-messages.component';
import { ReversePipePipe } from './pipes/reverse-pipe.pipe';
import { DeleteConversationPopupComponent } from './components/delete-conversation-popup/delete-conversation-popup.component';
import { DataService } from './services/data.service';
import { LoaderComponent } from './components/loader/loader.component';
import { CiscosparkDirective } from './ciscospark.directive';
import {PressEnterDirective} from './components/message-panel/KeyPress';
import { ContextMenuPopupComponent } from './components/context-menu-popup/context-menu-popup.component';
import { ContextMenuPanelComponent } from './components/context-menu-panel/context-menu-panel.component';
import { IncomingCallWidgetComponent } from './components/incoming-call-widget/incoming-call-widget.component';

const appRoutes: Routes = [];

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
    SendReceiveMessagesComponent,
    ReversePipePipe,
    DeleteConversationPopupComponent,
    LoaderComponent,
    CiscosparkDirective,
    PressEnterDirective,
    ContextMenuPopupComponent,
    ContextMenuPanelComponent,
    IncomingCallWidgetComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    FormsModule,
    RouterModule.forRoot(appRoutes, {}),
  ],
  providers: [
    // {provide: LocationStrategy, useClass: HashLocationStrategy}
    UtilService,
    LoginService,
    HttpService,
    ConfigService,
    MockService,
    DataService
  ],
  bootstrap: [FrontierWidgetComponent]
})
export class AppModule {
}
