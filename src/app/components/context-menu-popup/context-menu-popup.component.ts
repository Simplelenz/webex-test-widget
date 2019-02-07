import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {URL} from "../../configurations/UrlConstants";
import {RequestMethod, RequestOptions} from "@angular/http";
import {HttpService} from "../../services/http.service";

@Component({
  selector: 'app-context-menu-popup',
  templateUrl: './context-menu-popup.component.html',
  styleUrls: ['./context-menu-popup.component.css']
})
export class ContextMenuPopupComponent implements OnInit {

  @Input() showPopUp = false;
  @Input() contact: any;
  @Output() clickSpaceEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickChatFunction: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickCallFunction: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickVideoCallFunction: EventEmitter<any> = new EventEmitter<any>();
  conversation: any = [];

  constructor(private httpService: HttpService) {
  }

  ngOnInit() {
  }

  clickChat() {
    this.getConversation();
    this.clickSpace();
  }

  clickCall() {
    this.clickCallFunction.emit();
    this.clickSpace();
  }

  clickVideoCall() {
    this.clickVideoCallFunction.emit();
    this.clickSpace();
  }

  clickSpace() {
    this.clickSpaceEmit.emit(false);
  }

  getConversation() {
    const options = new RequestOptions();
    options.url = URL.WEBEX_API_BASE + (URL.MESSAGES).replace('{roomId}', this.contact.id);
    options.method = RequestMethod.Get;

    this.httpService.request(options).subscribe((response => {
      const temp: any = JSON.parse(response['_body']);
      this.conversation = temp.items;
      this.clickChatFunction.emit(this.conversation);
    }), error => {
      console.log(error);
    });
  }
}
