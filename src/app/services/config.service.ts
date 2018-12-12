import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

  /**
   * get configuration applied through config.js.
   * domain: the wrapper object. surf, tc, etc...
   * key: required configuration value
   * returns conifguration value (if not availabe returns undefined)
   */
  get(domain: string, key: string) {
    if (window[domain]) {
      return window[domain][key];
    }
    return undefined;
  }

  /*
  * set configuration values
  * */
  set(domain: string, key: string, value: any) {
    if (window[domain]) {
      window[domain][key] = value;
    }
  }

}
