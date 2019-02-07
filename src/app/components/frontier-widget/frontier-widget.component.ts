import {Component, OnInit, ElementRef, Input} from '@angular/core';
import {DataService} from "../../services/data.service";
import {log} from "util";

@Component({
  selector: 'app-frontier-widget',
  templateUrl: './frontier-widget.component.html',
  styleUrls: ['./frontier-widget.component.css']
})
export class FrontierWidgetComponent implements OnInit {

  @Input() email: string;
  showPanelContainer = false;
  isSuccess: boolean;
  showContextMenu = true;
  showContextPopUp = false;
  avatarContact: any;
  contextPanelData: any;
  spark: any;

  constructor(private elm: ElementRef, private dataService: DataService) {
    this.email = elm.nativeElement.getAttribute('email');
    // this.spark = this.dataService.getSpark();
  }

  ngOnInit() {
    console.log('frontier init');
  }

  showHidePanelContainer(event) {
    this.contextPanelData = undefined;
    this.showPanelContainer = event;
    this.showContextMenu = !event;
  }

  isAuthSuccess(event) {
    this.isSuccess = event;
    return this.isSuccess;
  }

  isSparkInit(event) {
    if (event) {
      this.spark = this.dataService.getSpark();
      this.handleIncomingCall();
    }
  }

  handleIncomingCall() {
    if (this.spark && this.spark.phone && !this.spark.phone.registered) {
      console.log('in handleIncomingCall');
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
              console.log('receiving call');
              const str = person ? `Anwser incoming call from ${person.displayName}` : 'Answer incoming call';
              if (confirm(str)) {
                call.answer();
                // bindCallEvents(call);
              } else {
                call.decline();
              }
            })
            .catch((err) => {
              console.error(err);
              alert(err);
            });
        }
      );
    }
  }

  contextPopUp(event) {
    this.showContextPopUp = event;
  }

  setAvatarContact(contact) {
    this.avatarContact = contact;
  }

  emitConversation(conversation) {
    this.showContextMenu = false;
    this.showPanelContainer = true;
    this.contextPanelData = {'contact': this.avatarContact, 'conversation': conversation};
  }

  clickCallFunction() {
    this.showContextMenu = false;
    this.showPanelContainer = true;
    this.contextPanelData = {'contact': this.avatarContact, 'conversation': 'audio'};
  }

  clickVideoCallFunction() {
    this.showContextMenu = false;
    this.showPanelContainer = true;
    this.contextPanelData = {'contact': this.avatarContact, 'conversation': 'video'};
  }
}
