import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IconConstant} from '../../configurations/IconConstants';
import {TAB} from '../navigation-bar/tabs.enum';
import {RequestMethod, RequestOptions} from '@angular/http';
import {URL} from '../../configurations/UrlConstants';
import {HttpService} from '../../services/http.service';
import {interval} from "rxjs/observable/interval";

@Component({
  selector: 'app-panel-container',
  templateUrl: './panel-container.component.html',
  styleUrls: ['./panel-container.component.css']
})
export class PanelContainerComponent implements OnInit {

  @Input() userName = '';
  @Input() email: string;
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
  myDetails: any;
  selectedContacts: any = [];

  constructor(private httpService: HttpService) {
    if (this.contactList.length === 0) {
      this.getAllContacts();
    }
    if (this.conversationList.length === 0) {
      this.getAllConversations();
    }
  }

  ngOnInit() {
    this.getPeopleDetails(this.email);
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
      this.contact = (popUpData.contactList[0]);
      const stream = interval(1000);
      stream.subscribe(() => {
        this.getConversation(this.contact);
      });
      this.getAllMembers(this.contact);
    }
  }

  popUpFunctionEmit(data) {
    if (data.state) {
      if (data.conversationName) {
        this.createConversation(data.conversationName);
      }
    } else {
      this.showPopUp = false;
    }
  }

  goBackPanelFunction() {
    if (this.panel === this.tab.CONVERSATION || this.panel === this.tab.CONTACTS || this.panel === this.tab.MESSAGE) {
      this.getAllConversations();
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

  createConversation(conversationName) {
    const options = new RequestOptions();
    options.url = URL.WEBEX_API_BASE + (URL.ROOMS);
    options.method = RequestMethod.Post;
    options.body = {title: conversationName};

    this.httpService.request(options).subscribe((response => {
      const temp: any = JSON.parse(response['_body']);
      this.contact = temp;

      this.selectedContacts.forEach((contact) => {
        this.createMemberships(contact.creatorId, this.contact.id);
      });

      this.showPopUp = false;
      this.visibleTabs = {CONVERSATION: false, CONTACTS: false, VIDEO: false, AUDIO: false, MESSAGE: true};
      this.panel = this.activatedTab = this.tab.MESSAGE;
      this.conversation = [];
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

  createMemberships(personId, roomId) {
    const options = new RequestOptions();
    options.url = URL.WEBEX_API_BASE + (URL.CREATE_MEMBERSHIPS);
    options.method = RequestMethod.Post;
    options.body = {
      personId: personId,
      roomId: roomId
    };

    this.httpService.request(options).subscribe((response => {
      const temp: any = JSON.parse(response['_body']);
      console.log(temp.items);
      this.getAllMembers(this.contact);
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

  getPeopleDetails(email) {
    const options = new RequestOptions();
    options.url = URL.WEBEX_API_BASE + (URL.PEOPLE).replace('{email}', email);
    options.method = RequestMethod.Get;

    this.httpService.request(options).subscribe((response => {
      const temp: any = JSON.parse(response['_body']);
      this.myDetails = temp.items[0];
      this.userName = temp.items[0].displayName;
    }), error => {
      console.log(error);
    });
  }
}

