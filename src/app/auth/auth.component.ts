import { Component, OnInit } from '@angular/core';
import { Constant } from '../configurations/StringConstants';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  private authCode: string;
  private isAuthenticated = false;
  private isWebexLoginDirected = false;

  constructor(private utilService: UtilService) { }

  ngOnInit() {
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
      window.location.href = 'https://api.ciscospark.com/v1/authorize?client_id=C2ae5541e22982ee50c0f6ac8b5856860accad2fe53ff10c8b2e236f9427a31f3&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&scope=spark%3Aall%20spark%3Akms&state=set_state_here';
    }
    if (this.isWebexLoginDirected) {
      this.authCode = this.getAuthCode();
    }
  }

  getAuthCode() {
    const queryParams = this.utilService.getQueryString();
    return queryParams && queryParams.code ?  queryParams.code : null;

  }

}
