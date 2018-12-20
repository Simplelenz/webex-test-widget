import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {IconConstant} from '../../configurations/IconConstants';
import {TAB} from '../navigation-bar/tabs.enum';
import {RequestMethod, RequestOptions} from '@angular/http';
import {URL} from '../../configurations/UrlConstants';
import {HttpService} from '../../services/http.service';
import {DataService} from '../../services/data.service';
import {interval} from 'rxjs/observable/interval';

@Component({
  selector: 'app-panel-container',
  templateUrl: './panel-container.component.html',
  styleUrls: ['./panel-container.component.css']
})
export class PanelContainerComponent implements OnInit, OnDestroy {

  @Input() userName = '';
  @Input() email: string;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  videoElem: ElementRef;
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

  constructor(private httpService: HttpService, private dataService: DataService) {
    if (this.contactList.length === 0) {
      this.getAllContacts();
    }
    if (this.conversationList.length === 0) {
      this.getAllConversations();
    }

    this.spark = this.dataService.getSpark();
  }

  ngOnInit() {
    this.getPeopleDetails(this.email);
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
      this.call();
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

  call() {
    this.connect()
      .then(() => {
        const call = this.spark.phone.dial(this.contact.id, this.constraints);

        // Call our helper function for binding events to calls
        this.bindCallEvents(call);
      });
  }

  bindCallEvents(call) {
    // call is a call instance, not a promise, so to know if things break,
    // we'll need to listen for the error event. Again, this is a rather naive
    // handler.
    call.on('error', (err) => {
      console.error(err);
      alert(err.stack);
    });

    // We can start rendering local and remote video before the call is
    // officially connected but not right when it's dialed, so we'll need to
    // listen for the streams to become available. We'll use `.once` instead
    // of `.on` because those streams will not change for the duration of
    // the call and it's one less event handler to worry about later.

    call.once('localMediaStream:change', () => {
      this.videoElem.nativeElement.srcObject = call.localMediaStream;
    });

    call.on('remoteMediaStream:change', () => {
      // Ok, yea, this is a little weird. There's a Chrome behavior that prevents
      // audio from playing from a video tag if there is no corresponding video
      // track.
      [
        'audio',
        'video'
      ].forEach((kind) => {
        if (call.remoteMediaStream) {
          const track = call.remoteMediaStream.getTracks().find((t) => t.kind === kind);
          if (track) {
            if (kind === 'audio') {
              this.viewAudioElem.nativeElement.srcObject = new MediaStream([track]);
            }
            if (kind === 'video') {
              this.viewVideoElem.nativeElement.srcObject = new MediaStream([track]);
            }
          }
        }
      });
    });

    // Once the call ends, we'll want to clean up our UI a bit
    call.on('inactive', () => {
      // Remove the streams from the UI elements
      this.videoElem.nativeElement.srcObject = undefined;
      this.viewAudioElem.nativeElement.srcObject = undefined;
      this.viewVideoElem.nativeElement.srcObject = undefined;
    });

    // Of course, we'd also like to be able to end the call:
    // document.getElementById('hangup').addEventListener('click', () => {
    //   call.hangup();
    // });
  }

  connect() {
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
            const str = person ? `Anwser incoming call from ${person.displayName}` : 'Answer incoming call';
            if (confirm(str)) {
              call.answer();
              this.bindCallEvents(call);
            } else {
              call.decline();
            }
          })
          .catch((err) => {
            console.error(err);
            // alert(err);
          });
      });

      return this.spark.phone.register()
        .then(() => {
          // This is just a little helper for our selenium tests and doesn't
          // really matter for the example
          // document.body.classList.add('listening');
          console.log('phone registered');
          // document.getElementById('connection-status').innerHTML = 'connected';
        })
        // This is a terrible way to handle errors, but anything more specific is
        // going to depend a lot on your app
        .catch((err) => {
          console.error(err);
          alert(err.stack);
          // we'll rethrow here since we didn't really *handle* the error, we just
          // reported it
          throw err;
        });
    }

    return Promise.resolve();
  }

  startUpdating() {
    this.tempInterval = interval(2000).subscribe(() => {
      this.getConversation(this.contact);
    });
  }

  terminateUpdating(subscribe) {
    setTimeout(() => subscribe.unsubscribe(), 0);
  }
}

