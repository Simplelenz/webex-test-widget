import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MockService } from './services/mock.service';
import { DataService } from './services/data.service';
import { Constant } from './configurations/StringConstants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  spark: any;
  accessToken: string;
  callerId: string;
  constraints = {
    audio: true,
    video: false
  };
  @ViewChild('videoElem') videoElem: ElementRef;
  @ViewChild('viewAudioElem') viewAudioElem: ElementRef;
  @ViewChild('viewVideoElem') viewVideoElem: ElementRef;

  constructor(private ms: MockService, private dataService: DataService) {
    ms.getMockJson('mocks/conversations.json');
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
              enableExperimentalGroupCallingSupport: true
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
