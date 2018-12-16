import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { URLSearchParams, RequestOptions, RequestMethod, Headers } from '@angular/http';
import { Constant } from '../configurations/StringConstants';
import { URL } from '../configurations/UrlConstants';

@Injectable()
export class LoginService {
  constructor(private httpService: HttpService) {

  }

  getAccessToken(grantType: string, clientId: string, clientSecret: string, authCode: string, redirectUri: string) {
    const options = new RequestOptions;
    options.url = URL.WEBEX_API_BASE + URL.ACCESS_TOKEN;
    options.method = RequestMethod.Post;
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const params = new URLSearchParams();
    params.append(Constant.GRANT_TYPE , grantType);
    params.append(Constant.CLIENT_ID, clientId);
    params.append(Constant.CLIENT_SECRET, clientSecret);
    params.append(Constant.CODE, authCode);
    params.append(Constant.REDIRECT_URI, redirectUri);
    options.body = params;

    return this.httpService.request(options);
  }
}
