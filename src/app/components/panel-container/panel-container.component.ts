import {
  Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef, OnDestroy, OnChanges, AfterViewInit
} from '@angular/core';
import {IconConstant} from '../../configurations/IconConstants';
import {TAB} from '../navigation-bar/tabs.enum';
import {RequestMethod, RequestOptions} from '@angular/http';
import {URL} from '../../configurations/UrlConstants';
import {HttpService} from '../../services/http.service';
import {DataService} from '../../services/data.service';
import {interval} from 'rxjs/observable/interval';
import {SimpleChanges} from '@angular/core';
import {IncomingCallAnswerService} from "../../services/incoming-call-answer.service";

@Component({
  selector: 'app-panel-container',
  templateUrl: './panel-container.component.html',
  styleUrls: ['./panel-container.component.css']
})
export class PanelContainerComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {

  @Input() userName = '';
  @Input() email: string;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  @Input() contextPanelData: any;

  @ViewChild('videoElem') videoElem: ElementRef;
  viewVideoElem: ElementRef;
  viewAudioElem: ElementRef;

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
  newConversation = false;
  spark: any;
  constraints = {
    audio: true,
    video: false
  };
  tempInterval: any;
  backDisable = false;

  constructor(private httpService: HttpService, private dataService: DataService, private incomingCallAnswerService: IncomingCallAnswerService) {
    if (this.contactList.length === 0) {
      this.getAllContacts();
    }
    if (this.conversationList.length === 0) {
      this.getAllConversations();
    }

    this.spark = this.dataService.getSpark();
  }

  ngOnInit() {
    if (this.contextPanelData && !(this.contextPanelData.conversation === 'audio' || this.contextPanelData.conversation === 'video')) {
      this.contact = this.contextPanelData.contact;
      this.getConversation(this.contact);
      this.getAllMembers(this.contact);
    }
    this.getPeopleDetails(this.email);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contextPanelData']) {
      if (this.contextPanelData) {
        if (this.contextPanelData.conversation) {
          if (this.contextPanelData.conversation === 'audio') {
            this.clickCallFunctionEmit(this.tab.AUDIO);
            this.backDisable = true;
          }
          if (this.contextPanelData.conversation === 'video') {
            this.clickCallFunctionEmit(this.tab.VIDEO);
            this.backDisable = true;
          }
        }
      }
    }
  }

  ngAfterViewInit() {
    this.handleIncomingCalls();
  }

  clickClose() {
    this.close.emit(false);
  }

  ngOnDestroy() {
    // this.terminateUpdating(this.tempInterval);
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
      this.getConversation(this.contact);
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
      // this.call();
    }
  }

  closeVideoCallFunctionEmit() {
    if ((this.contextPanelData !== undefined) && (this.contextPanelData.conversation === 'audio' || this.contextPanelData.conversation === 'video')) {
      this.clickClose();
    } else {
      this.visibleTabs = {CONVERSATION: false, CONTACTS: false, VIDEO: false, AUDIO: false, MESSAGE: true};
      this.panel = this.activatedTab = this.tab.MESSAGE;
    }
  }

  closeAudioCallFunctionEmit() {
    if ((this.contextPanelData !== undefined) && (this.contextPanelData.conversation === 'audio' || this.contextPanelData.conversation === 'video')) {
      this.clickClose();
    } else {
      this.visibleTabs = {CONVERSATION: false, CONTACTS: false, VIDEO: false, AUDIO: false, MESSAGE: true};
      this.panel = this.activatedTab = this.tab.MESSAGE;
    }
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

  startUpdating() {
    this.tempInterval = interval(2000).subscribe(() => {
      this.getConversation(this.contact);
    });
  }

  terminateUpdating(subscribe) {
    setTimeout(() => subscribe.unsubscribe(), 0);
  }

  handleIncomingCalls() {
    if (!this.spark.phone.registered) {
      // we want to start listening for incoming calls *before* registering with
      // the cloud so that we can join any calls that may already be in progress.
      this.spark.phone.on('call:incoming', (call) => {
        Promise.resolve()
          .then(() => {
            // Let's render the name of the person calling us. Note that calls
            // from external sources (some SIP URIs, PSTN numbers, etc) may not
            // have personIds, so we can't assume that field will exist.
            if (call.from && call.from.personId) {
              // In production, you'll want to cache this so you don't have to do
              // a fetch on every incoming call.
              return this.spark.people.get(call.from.personId);
            }

            return Promise.resolve();
          })
          .then((person) => {

            this.incomingCallAnswerService.setShowIncomingCallWidgetState(true);

            const str = person ? `Anwser incoming call from ${person.displayName}` : 'Answer incoming call';

            this.incomingCallAnswerService.getCallState().subscribe((res) => {
              if (res === true) {
                call.answer();
                this.incomingCallAnswerService.setCallState(undefined);
                this.incomingCallAnswerService.setShowIncomingCallWidgetState(false);
              }
              if (res === false) {
                call.decline();
                this.incomingCallAnswerService.setCallState(undefined);
                this.incomingCallAnswerService.setShowIncomingCallWidgetState(false);
              }
            });
          })
          .catch((err) => {
            console.error(err);
            alert(err);
          });
      });
    }
  }
}

