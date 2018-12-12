import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpService {

  constructor(private httpClient: HttpClient) {

  }

  request(options: HttpRequest<any>) {
    options.params.set('timestamp', (new Date()).getTime().toString());
    return this.processRequest(options);
  }

  processRequest(options: HttpRequest<any>) {
    return this.httpClient.request(
      options.method.toString(),
      options.url,
      options
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
