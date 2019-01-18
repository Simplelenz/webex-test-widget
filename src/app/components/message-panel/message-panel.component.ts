import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {IconConstant} from '../../configurations/IconConstants';
import {TAB} from '../navigation-bar/tabs.enum';
import {HttpService} from '../../services/http.service';
import {Http, RequestMethod, RequestOptions} from '@angular/http';
import {URL} from '../../configurations/UrlConstants';
// import * as base from 'base64-url';
import {interval} from 'rxjs/observable/interval';
import {CONF, Constant} from '../../configurations/StringConstants';
import {Attachment} from './Attachment';
import {ConfigService} from '../../services/config.service';

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
  newFile: any;
  tempInterval1: any;
  tempInterval2: any;
  tempInterval3: any;
  attachments: Array<Attachment> = [];
  tempAttachments: Array<Attachment> = [];
  initStageFileNames = true;

  constructor(private httpService: HttpService, private http: Http, private configService: ConfigService) {
  }

  ngOnInit() {
    this.conversation = [];
    this.attachments = [];
    this.tempAttachments = [];
    this.startUpdating();
  }

  ngOnDestroy() {
    this.terminateUpdating1(this.tempInterval1);
    this.terminateUpdating2(this.tempInterval2);
    this.terminateUpdating3(this.tempInterval3);
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

      if (!this.newFile) {
        const options = new RequestOptions();
        options.url = URL.WEBEX_API_BASE + URL.SEND_MESSAGE;
        options.method = RequestMethod.Post;
        options.body = {'roomId': this.contact.id, text: this.newMessage};

        this.httpService.request(options).subscribe((response => {
          this.getConversation();
        }), error => {
          console.log(error);
        });
      } else {
        this.sendFile(this.newFile);
      }

      this.newMessage = undefined;
      this.newFile = undefined;
    }
  }

  getConversation() {
    const options = new RequestOptions();
    options.url = URL.WEBEX_API_BASE + (URL.MESSAGES).replace('{roomId}', this.contact.id);
    options.method = RequestMethod.Get;

    this.httpService.request(options).subscribe((response => {
      const temp: any = JSON.parse(response['_body']);
      this.conversation = temp.items;
      this.conversation = this.conversation.reverse();
    }), error => {
      console.log(error);
    });
  }

  chooseImageFile(event) {
    this.newFile = event.target.files[0];
    this.newMessage = this.newFile.name;
    // this.sendFile(file);
  }

  sendFile(file: File) {
    const options = new RequestOptions();
    options.url = URL.WEBEX_API_BASE + URL.SEND_MESSAGE;
    options.method = RequestMethod.Post;
    const body: FormData = new FormData();
    body.append(Constant.ROOM_ID, this.contact.id);
    body.append(Constant.FILES, file);
    options.body = body;
    // options.body = {'files': path, 'roomId': this.contact.id, text: 'lakshitha'};

    this.httpService.request(options).subscribe((response => {
      this.getConversation();
    }), error => {
      console.log(error);
    });
    this.newFile = undefined;
    this.newMessage = undefined;
  }

  startUpdating() {
    this.tempInterval1 = interval(2000).subscribe(() => {
      this.getConversation();
    });
    if (this.initStageFileNames) {
      this.tempInterval2 = interval(3000).subscribe(() => {
        this.initStageFileNames = false;
        this.setAttachmentsArray();
      });
    } else {
      this.tempInterval3 = interval(1000).subscribe(() => {
        this.setAttachmentsArray();
      });
    }
  }

  terminateUpdating1(subscribe) {
    if (subscribe) {
      setTimeout(() => subscribe.unsubscribe(), 0);
    }
  }

  terminateUpdating2(subscribe) {
    if (subscribe) {
      setTimeout(() => subscribe.unsubscribe(), 0);
    }
  }

  terminateUpdating3(subscribe) {
    if (subscribe) {
      setTimeout(() => subscribe.unsubscribe(), 0);
    }
  }

  setAttachmentsArray() {
    const temp = [];
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;

    this.conversation.forEach((message, i) => {
      if (message.text === undefined) {
        temp.push(new Attachment(this.conversation.length - (i + 1), message.files[0], ''));
      } else {
        temp.push(new Attachment(this.conversation.length - (i + 1), Math.random(), '*'));
      }
    });
    if (temp.length !== this.tempAttachments.length) {
      this.tempAttachments = temp;
    }
    if (this.tempAttachments.length !== this.attachments.length) {
      this.attachments = [];
      const difference = this.tempAttachments.filter(e => !this.attachments.find(a => e.url === a.url));
      difference.forEach((item) => {
        if (item.fileName !== '*') {
          this.getFileName(item.url).subscribe((response => {
            const matches = filenameRegex.exec(JSON.parse(response._body)['content-disposition']);
            if (matches != null && matches[1]) {
              const fileName = (matches[1].replace(/['"]/g, ''));
              this.attachments.push(new Attachment(item.index, item.url, fileName));
              this.attachments = this.attachments.sort((a, b) => b.index - a.index);
            }
          }), error => {
            console.log(error);
          });
        } else {
          this.attachments.push(new Attachment(item.index, item.url, ''));
        }
      });
    }
  }

  getFileName(url: string): any {
    return this.http.get(this.configService.get(CONF.FRONTIER, CONF.NODE_SERVER_BASE_URL) + 'file-name?token=' + JSON.parse(localStorage.getItem(Constant.WEBEX_TOKENS)).access_token + '&suffix=' + url.split('/contents/')[1]);
  }
}
