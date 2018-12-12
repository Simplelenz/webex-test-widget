import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpRequest } from '@angular/common/http';

@Injectable()
export class LoginService {
  constructor(private httpService: HttpService) {

  }

  getAccessToken(grantType: string, clientId: string, clientSecret: string, authCode: string, redirectUri: string) {
    const url = 'https://api.ciscospark.com/v1/access_token';
    const method = 'POST';
    const params = new URLSearchParams();
    params.append('grant_type' , grantType);
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('code', authCode);
    params.append('redirect_uri', redirectUri);
    const options = new HttpRequest(method, url, params);

    return this.httpService.request(options);
  }
}
