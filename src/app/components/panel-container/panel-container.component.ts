import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IconConstant} from '../../configurations/IconConstants';
import {TAB} from '../navigation-bar/tabs.enum';
import {RequestMethod, RequestOptions} from '@angular/http';
import {URL} from '../../configurations/UrlConstants';
import {HttpService} from '../../services/http.service';

@Component({
  selector: 'app-panel-container',
  templateUrl: './panel-container.component.html',
  styleUrls: ['./panel-container.component.css']
})
export class PanelContainerComponent implements OnInit {

  @Input() userName = 'Hello Kevin';
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  IconConstant: any = IconConstant;
  tab: any = TAB;
  panel = this.tab.CONVERSATION;
  showPopUp = false;
  showDeletePopUp = false;
  visibleTabs = {CONVERSATION: true, CONTACTS: true, VIDEO: false, AUDIO: false, MESSAGE: false};
  activatedTab = this.tab.CONVERSATION;
  contactList: any = [];
  conversationList: any = [];
  conversation: any = [];
  members: any = [];
  contact: any;
  showDoneButton = false;

  constructor(private httpService: HttpService) {
    if (this.contactList.length === 0) {
      this.getAllContacts();
    }
    if (this.conversationList.length === 0) {
      this.getAllConversations();
    }
  }

  ngOnInit() {
  }

  clickClose() {
    this.close.emit(false);
  }

  changePanel(tabNum) {
    this.panel = tabNum;
  }

  clickDoneFunctionEmit(popUpData) {
    this.showPopUp = popUpData.popUp;
    if (popUpData.contactList.length === 1) {
      this.visibleTabs = {CONVERSATION: false, CONTACTS: false, VIDEO: false, AUDIO: false, MESSAGE: true};
      this.panel = this.tab.MESSAGE;
      this.activatedTab = this.tab.MESSAGE;
    }
  }

  popUpFunctionEmit(data) {
    if (data.state) {
      if (data.conversationName) {
        this.showPopUp = false;
        this.visibleTabs = {CONVERSATION: false, CONTACTS: false, VIDEO: false, AUDIO: false, MESSAGE: true};
        this.panel = this.activatedTab = this.tab.MESSAGE;
      }
    } else {
      this.showPopUp = false;
    }
  }

  goBackPanelFunction() {
    if (this.panel === this.tab.CONVERSATION || this.panel === this.tab.CONTACTS || this.panel === this.tab.MESSAGE) {
      this.visibleTabs = {CONVERSATION: true, CONTACTS: true, VIDEO: false, AUDIO: false, MESSAGE: false};
      this.panel = this.activatedTab = this.tab.CONVERSATION;
    }
    if (this.panel === this.tab.VIDEO || this.panel === this.tab.AUDIO) {
      this.visibleTabs = {CONVERSATION: false, CONTACTS: false, VIDEO: false, AUDIO: false, MESSAGE: true};
      this.panel = this.activatedTab = this.tab.MESSAGE;
    }
  }

  clickCallFunctionEmit(type) {
    if (type === this.tab.VIDEO) {
      this.visibleTabs = {CONVERSATION: false, CONTACTS: false, VIDEO: true, AUDIO: false, MESSAGE: false};
      this.panel = this.activatedTab = this.tab.VIDEO;
    }
    if (type === this.tab.AUDIO) {
      this.visibleTabs = {CONVERSATION: false, CONTACTS: false, VIDEO: false, AUDIO: true, MESSAGE: false};
      this.panel = this.activatedTab = this.tab.AUDIO;
    }
  }

  closeVideoCallFunctionEmit() {
    this.visibleTabs = {CONVERSATION: false, CONTACTS: false, VIDEO: false, AUDIO: false, MESSAGE: true};
    this.panel = this.activatedTab = this.tab.MESSAGE;
  }

  closeAudioCallFunctionEmit() {
    this.visibleTabs = {CONVERSATION: false, CONTACTS: false, VIDEO: false, AUDIO: false, MESSAGE: true};
    this.panel = this.activatedTab = this.tab.MESSAGE;
  }

  clickNewFunctionEmit() {
    this.visibleTabs = {CONVERSATION: true, CONTACTS: true, VIDEO: false, AUDIO: false, MESSAGE: false};
    this.panel = this.activatedTab = this.tab.CONTACTS;
  }

  getAllContacts() {
    const options = new RequestOptions();
    options.url = URL.WEBEX_API_BASE + URL.ROOMS;
    options.method = RequestMethod.Get;

    this.httpService.request(options).subscribe((response => {
      const temp: any = JSON.parse(response['_body']);
      this.contactList = temp.items;
    }), error => {
      console.log(error);
    });
  }

  getAllConversations() {
    const options = new RequestOptions();
    options.url = URL.WEBEX_API_BASE + URL.ROOMS;
    options.method = RequestMethod.Get;

    this.httpService.request(options).subscribe((response => {
      const temp: any = JSON.parse(response['_body']);
      this.conversationList = temp.items;
    }), error => {
      console.log(error);
    });
  }

  getConversation(contact) {
    const options = new RequestOptions();
    options.url = URL.WEBEX_API_BASE + (URL.MESSAGES).replace('{roomId}', contact.id);
    options.method = RequestMethod.Get;

    this.httpService.request(options).subscribe((response => {
      const temp: any = JSON.parse(response['_body']);
      this.conversation = temp.items;
      this.visibleTabs = {CONVERSATION: false, CONTACTS: false, VIDEO: false, AUDIO: false, MESSAGE: true};
      this.panel = this.activatedTab = this.tab.MESSAGE;
    }), error => {
      console.log(error);
    });
  }

  getAllMembers(contact) {
    const options = new RequestOptions();
    options.url = URL.WEBEX_API_BASE + (URL.MEMBERSHIPS).replace('{roomId}', contact.id);
    options.method = RequestMethod.Get;

    this.httpService.request(options).subscribe((response => {
      const temp: any = JSON.parse(response['_body']);
      this.members = temp.items;
    }), error => {
      console.log(error);
    });
  }

  deleteConversationFunction(state) {
    if (state) {
      this.deleteConversation(this.contact);
    } else {
      this.showDeletePopUp = false;
    }

  }

  deleteConversationEmit(contact) {
    this.contact = contact;
  }

  deleteConversation(contact) {
    const options = new RequestOptions();
    options.url = URL.WEBEX_API_BASE + (URL.DELETE_ROOMS).replace('{roomId}', contact.id);
    options.method = RequestMethod.Delete;

    this.httpService.request(options).subscribe((response => {
      this.getAllConversations();
      this.getAllContacts();
      this.showDeletePopUp = false;
    }), error => {
      console.log(error);
      this.showDeletePopUp = false;
    });
  }
}

