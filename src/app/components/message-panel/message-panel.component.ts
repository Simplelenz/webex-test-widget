import {Component, EventEmitter, Input, OnInit, Output, OnDestroy} from '@angular/core';
import {IconConstant} from '../../configurations/IconConstants';
import {TAB} from '../navigation-bar/tabs.enum';
import {HttpService} from '../../services/http.service';
import {RequestMethod, RequestOptions} from '@angular/http';
import {URL} from '../../configurations/UrlConstants';
import * as base from 'base64-url';
import {interval} from 'rxjs/observable/interval';

@Component({
  selector: 'app-message-panel',
  templateUrl: './message-panel.component.html',
  styleUrls: ['./message-panel.component.css']
})
export class MessagePanelComponent implements OnInit, OnDestroy {

  @Input() conversation: any = [];
  @Input() members: any = [];
  @Input() contact: any;
  @Input() email: string;
  @Input() newConversation = false;
  @Output() clickCallFunction: EventEmitter<any> = new EventEmitter<any>();

  tab: any = TAB;
  IconConstant: any = IconConstant;
  newMessage: string;
  tempInterval: any;

  constructor(private httpService: HttpService) {
  }

  ngOnInit() {
    this.conversation = [];
    this.startUpdating();
  }

  ngOnDestroy() {
    this.terminateUpdating(this.tempInterval);
  }

  clickVideoCall() {
    this.clickCallFunction.emit(this.tab.VIDEO);
  }

  clickAudioCall() {
    this.clickCallFunction.emit(this.tab.AUDIO);
  }

  formatLastActivity(UTC): any {
    return new Date(UTC);
  }

  getDisplayName(mail): any {
    let temp;
    this.members.forEach((member) => {
      if (member.personEmail === mail) {
        temp = member.personDisplayName;
      }
    });
    return temp;
  }

  sendNewMessage(event) {
    if (event.key === 'Enter' && this.newMessage) {

      const options = new RequestOptions();
      options.url = URL.WEBEX_API_BASE + URL.SEND_MESSAGE;
      options.method = RequestMethod.Post;
      options.body = {'roomId': this.contact.id, text: this.newMessage};

      this.httpService.request(options).subscribe((response => {
        this.getConversation();
      }), error => {
        console.log(error);
      });
      this.newMessage = undefined;
    }
  }

  getConversation() {
    const options = new RequestOptions();
    options.url = URL.WEBEX_API_BASE + (URL.MESSAGES).replace('{roomId}', this.contact.id);
    options.method = RequestMethod.Get;

    this.httpService.request(options).subscribe((response => {
      const temp: any = JSON.parse(response['_body']);
      this.conversation = temp.items;
    }), error => {
      console.log(error);
    });
  }

  chooseImageFile(event) {
    if (event.target.files.item(0).type.split('/')[0]) {
      console.log(event.target.files);
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // this.sendFile(e.target.result);
        // console.log(e.target.result);
        // console.log(base.escape(e.target.result));
      };
      reader.readAsDataURL(file);
    } else {
      console.error('unsupported file type :( ');
    }
  }

  sendFile(path) {
    const options = new RequestOptions();
    options.url = URL.WEBEX_API_BASE + URL.SEND_MESSAGE;
    options.method = RequestMethod.Post;
    options.body = {'files': path, 'roomId': this.contact.id, text: 'lakshitha'};

    this.httpService.request(options).subscribe((response => {
      this.getConversation();
    }), error => {
      console.log(error);
    });
  }

  startUpdating() {
    this.tempInterval = interval(2000).subscribe(() => {
      this.getConversation();
    });
  }

  terminateUpdating(subscribe) {
    setTimeout(() => subscribe.unsubscribe(), 0);
  }
}
