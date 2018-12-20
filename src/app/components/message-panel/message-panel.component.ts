import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconConstant } from '../../configurations/IconConstants';
import { TAB } from '../navigation-bar/tabs.enum';
import { HttpService } from '../../services/http.service';
import { RequestMethod, RequestOptions, Headers } from '@angular/http';
import { URL } from '../../configurations/UrlConstants';

@Component({
  selector: 'app-message-panel',
  templateUrl: './message-panel.component.html',
  styleUrls: ['./message-panel.component.css']
})
export class MessagePanelComponent implements OnInit {

  @Input() conversation: any = [];
  @Input() members: any = [];
  @Input() contact: any;
  @Input() email: string;
  @Output() clickCallFunction: EventEmitter<any> = new EventEmitter<any>();

  tab: any = TAB;
  IconConstant: any = IconConstant;
  newMessage: string;
  filePath: string;
  fileType: string;

  constructor(private httpService: HttpService) {
  }

  ngOnInit() {
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
    if (event.key === 'Enter' && this.newMessage !== undefined && this.filePath === undefined) {

      const options = new RequestOptions();
      options.url = URL.WEBEX_API_BASE + URL.SEND_MESSAGE;
      options.method = RequestMethod.Post;
      options.body = { 'roomId': this.contact.id, text: this.newMessage };

      this.httpService.request(options).subscribe((response => {
        this.getConversation();
      }), error => {
        console.log(error);
      });
      this.newMessage = undefined;
    }

    if (event.key === 'Enter' && this.filePath !== undefined) {
      while (this.filePath.includes('\\')) {
        this.filePath = this.filePath.replace('\\', '/');
      }
      const options = new RequestOptions();
      options.url = URL.WEBEX_API_BASE + URL.SEND_MESSAGE;
      options.headers = new Headers();
      options.headers.append('Content-Type', 'multipart/form-data');
      options.method = RequestMethod.Post;
      options.body = new FormData();
      options.body.append('roomId', this.contact.id);
      options.body.append('files', '@' + this.filePath + ';type=' + this.fileType);
      // options.body = { 'roomId': this.contact.id, text: this.newMessage };

      this.httpService.request(options).subscribe((response => {
        this.getConversation();
      }), error => {
        console.log(error);
      });
      this.newMessage = undefined;
      this.filePath = undefined;
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

  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileType = file.type;
    }
  }
}
