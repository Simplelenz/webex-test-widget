import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class MockService {

  constructor(private http: HttpClient) {
  }

  getMockJson(path: string) {
    this.http.get(path).subscribe((response => {
      console.log(response);
    }), error => {
      console.log(error);
    })
  }

}
