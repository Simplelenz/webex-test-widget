import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {URL} from '../../configurations/UrlConstants';
import {RequestMethod, RequestOptions} from '@angular/http';
import {HttpService} from '../../services/http.service';
import {CONF, Constant} from '../../configurations/StringConstants';
import {ConfigService} from '../../services/config.service';
import {UtilService} from '../../services/util.service';
import {LoginService} from '../../services/login.service';

@Component({
  selector: 'app-context-menu-panel',
  templateUrl: './context-menu-panel.component.html',
  styleUrls: ['./context-menu-panel.component.css']
})
export class ContextMenuPanelComponent implements OnInit {

  @Output() clickAvatarEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() avatarContactEmit: EventEmitter<any> = new EventEmitter<any>();

  contactList: any = [];
  private clientId: string;
  private clientSecret: string;

  constructor(private utilService: UtilService, private loginService: LoginService, private httpService: HttpService, private configService: ConfigService) {
    this.getAllContacts();
  }

  ngOnInit() {
    this.clientId = this.configService.get(CONF.FRONTIER, CONF.CLIENT_ID);
    this.clientSecret = this.configService.get(CONF.FRONTIER, CONF.CLIENT_SECRET);
  }

  clickAvatar(contact) {
    this.clickAvatarEmit.emit(true);
    this.avatarContactEmit.emit(contact);
  }

  getAllContacts() {
    const options = new RequestOptions();
    options.url = URL.WEBEX_API_BASE + URL.ROOMS;
    options.method = RequestMethod.Get;

    this.httpService.request(options).subscribe((response => {
      const temp: any = JSON.parse(response['_body']);
      this.contactList = temp.items.filter((item) => {
        return item.type === 'direct';
      });

    }), error => {
      console.log(error);
      if ((error.status === 401) && (error.statusText === 'Unauthorized')) {

        try {
          if (JSON.parse(error['_body']).message.includes(Constant.REFRESH_ACCESS_TOKEN_ERROR)) {
            const refreshToken = JSON.parse(localStorage.getItem(Constant.WEBEX_TOKENS)).refresh_token;
            const subscription = this.loginService.refreshAccessToken('refresh_token', this.clientId, this.clientSecret, refreshToken).subscribe(
              (response) => {
                subscription.unsubscribe();
                const isAuthenticated = JSON.parse(response['_body']).access_token ? true : false;
                localStorage.setItem(Constant.IS_AUTHENTICATED, isAuthenticated.toString());
                localStorage.setItem(Constant.WEBEX_TOKENS, response['_body']);
                window.location.reload();
              }, (err) => {
                console.log(err);
                localStorage.setItem(Constant.IS_AUTHENTICATED, (false).toString());
                localStorage.setItem(Constant.IS_WEBEX_LOGIN_DIRECTED, (false).toString());
                window.location.reload();
              }
            );
          }
        } catch (error) {
          console.error(error);
          localStorage.setItem(Constant.IS_AUTHENTICATED, (false).toString());
          localStorage.setItem(Constant.IS_WEBEX_LOGIN_DIRECTED, (false).toString());
          window.location.reload();
        }

      }
    });
  }

  getIcon(i): number {
    return (i.toString().split('')[i.toString().split('').length - 1]);
  }
}
