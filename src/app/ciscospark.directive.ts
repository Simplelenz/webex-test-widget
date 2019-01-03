import { Directive, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { Constant } from './configurations/StringConstants';

@Directive({
  selector: '[appCiscospark]'
})
export class CiscosparkDirective implements OnInit {
  spark: any;
  accessToken: string;

  constructor(private dataService: DataService) {
    this.accessToken = this.dataService.getAccessToken();
   }

  ngOnInit(): void {
    if (this.accessToken === undefined) {
      this.accessToken = JSON.parse(localStorage.getItem(Constant.WEBEX_TOKENS)).access_token;
      this.dataService.setAccessToken(this.accessToken);
    }
    this.initSpark();
  }

  initSpark() {
    try {
      this.spark = this.dataService.getSpark();
      if (!this.spark) {
        this.spark = ciscospark.init({
          config: {
            phone: {
              // Turn on group calling; there's a few minor breaking changes with
              // regards to how single-party calling works (hence, the opt-in), but
              // this is how things are going to work in 2.0 and if you plan on
              // doing any group calls, you'll need this turned on for your entire
              // app anyway.
              enableExperimentalGroupCallingSupport: false
            }
          },
          credentials: {
            access_token: this.accessToken
          }
        });
        this.dataService.setSpark(this.spark);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

declare var ciscospark: any;
