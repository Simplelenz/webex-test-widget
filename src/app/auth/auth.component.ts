import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Constant, CONF } from '../configurations/StringConstants';
import { URL } from '../configurations/UrlConstants';
import { LoginService } from '../services/login.service';
import { UtilService } from '../services/util.service';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  private authCode: string;
  private isAuthenticated = false;
  private isWebexLoginDirected = false;
  private redirectUri: string;
  private clientId: string;
  private clientSecret: string;

  constructor(private utilService: UtilService, private loginService: LoginService, private configService: ConfigService) {
  }

  ngOnInit() {
    this.redirectUri = this.configService.get(CONF.FRONTIER, CONF.REDIRECT_URI);
    this.clientId = this.configService.get(CONF.FRONTIER, CONF.CLIENT_ID);
    this.clientSecret = this.configService.get(CONF.FRONTIER, CONF.CLIENT_SECRET);
    this.handleExternalAuth();
  }

  handleExternalAuth() {
    if (localStorage.getItem(Constant.IS_WEBEX_LOGIN_DIRECTED)) {
      this.isWebexLoginDirected = localStorage.getItem(Constant.IS_WEBEX_LOGIN_DIRECTED) === 'true' ? true : false;
    } else {
      localStorage.setItem(Constant.IS_WEBEX_LOGIN_DIRECTED, this.isWebexLoginDirected.toString());
    }
    if (!this.isWebexLoginDirected) {
      this.isWebexLoginDirected = true;
      localStorage.setItem(Constant.IS_WEBEX_LOGIN_DIRECTED, this.isWebexLoginDirected.toString());
      const externalUrl = URL.WEBEX_API_BASE + URL.AUTHORIZE + '?client_id=' + this.clientId + '&response_type=code&redirect_uri=' + encodeURIComponent(this.redirectUri) + '&scope=' + encodeURIComponent('spark:all spark:kms') + '&state=set_state_here';
      console.log(externalUrl);
      window.location.href = externalUrl;
    }
    if (this.isWebexLoginDirected) {
      this.authCode = this.getAuthCode();
    }
    if (this.authCode) {
      this.getAccessToken();
    }
  }

  getAuthCode() {
    const queryParams = this.utilService.getQueryString();
    return queryParams && queryParams.code ?  queryParams.code : null;
  }

  getAccessToken() {
    let subscription = new Subscription();
    const grantType = Constant.AUTHORIZATION_CODE;
    // const clientId = 'C2ae5541e22982ee50c0f6ac8b5856860accad2fe53ff10c8b2e236f9427a31f3';
    // const clientSecret = '32e0539e7574c5dbecb153ff95904e8a57d2d8682a6a49850953d2cf48520bfa';
    // const redirectUri = 'http://localhost:3000/';
    subscription = this.loginService.getAccessToken(grantType, this.clientId, this.clientSecret, this.authCode, this.redirectUri).subscribe(
      response => {
        subscription.unsubscribe();
        try {
          this.isAuthenticated = JSON.parse(response['_body']).access_token ? true : false;
          localStorage.setItem(Constant.WEBEX_TOKENS, response['_body']);
        } catch (error) {
          console.error(error);
        }
      },
      error => {
        console.error(error);
      }
    );
  }

}
