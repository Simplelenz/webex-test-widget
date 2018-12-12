import { Injectable } from '@angular/core';
import { QueryParams } from '../models/QueryParams';

@Injectable()
export class UtilService {

  getQueryString(queryString?: string): QueryParams {
    let vars: QueryParams = new QueryParams;
    let hash = {};
    let str = '';
    if (queryString) {
      str = queryString;
    } else {
      if (window.location.href.indexOf('?') > -1) {
        str = window.location.href.slice(window.location.href.indexOf('?') + 1);
      } else {
        return vars;
      }
    }
    if (str) {
      let hashes = str.split('&');
      for (let i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars[hash[0]] = decodeURIComponent(hash[1]);
      }
    }
    return vars;
  }

}
