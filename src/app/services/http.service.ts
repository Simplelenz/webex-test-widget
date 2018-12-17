import {Injectable} from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Constant} from '../configurations/StringConstants';

@Injectable()
export class HttpService {

  constructor(private http: Http) {

  }

  request(options: RequestOptions) {

    if (localStorage.getItem(Constant.WEBEX_TOKENS)) {
      const accessToken = JSON.parse(localStorage.getItem(Constant.WEBEX_TOKENS)).access_token;
      if (options.headers === undefined || options.headers === null) {
        options.headers = new Headers();
      }
      options.headers.append(Constant.AUTHORIZATION_HEADER, Constant.BEARER + ' ' + accessToken);
    }

    // options.url.concat('timestamp', (new Date()).getTime().toString());
    return this.processRequest(options);
  }

  processRequest(options: RequestOptions) {
    return this.http.request(options.url, options
    );
  }

  handleError(error: any): Observable<any> {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    const errMsg = (error._body) ? error._body :
      error.status ? `${error.status} - ${error.statusText}` : (error._body) ? error._body : 'Server error';
    return Observable.throw(error);
  }
}
