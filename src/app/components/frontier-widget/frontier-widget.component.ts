import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {IncomingCallAnswerService} from '../../services/incoming-call-answer.service';

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

  constructor(private elm: ElementRef, private dataService: DataService, private incomingCallAnswerService: IncomingCallAnswerService) {
    this.email = elm.nativeElement.getAttribute('email');
  }

  ngOnInit() {
    const audio = new Audio('/assets/ringing-tones/tone.mp3');

    const div = document.createElement('div');
    div.className = 'frontier_message';
    div.style.visibility = 'hidden';

    const p = document.createElement('p');
    p.className = 'frontier_message--box';

    const acceptButton = document.createElement('button');
    acceptButton.className = 'accept';
    acceptButton.textContent = 'Accept';
    acceptButton.onclick = () => {
      this.incomingCallAnswerService.setCallState(true);
      div.style.visibility = 'hidden';
      audio.pause();
    };

    const declineButton = document.createElement('button');
    declineButton.className = 'decline';
    declineButton.textContent = 'Decline';
    declineButton.onclick = () => {
      this.incomingCallAnswerService.setCallState(false);
      div.style.visibility = 'hidden';
      audio.pause();
    };

    div.appendChild(p);
    p.appendChild(acceptButton);
    p.appendChild(declineButton);

    this.elm.nativeElement.appendChild(div);

    this.incomingCallAnswerService.getShowIncomingCallWidgetState().subscribe((res) => {
      if (res === true) {
        div.style.visibility = 'visible';
        audio.play();
      }
    });
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

              this.incomingCallAnswerService.getCallState().subscribe((res) => {
                if (res === true) {
                  call.answer();
                  this.incomingCallAnswerService.setCallState(undefined);
                }
                if (res === false) {
                  call.decline();
                  this.incomingCallAnswerService.setCallState(undefined);
                }
              });

              // if (confirm(str)) {
              //   call.answer();
              //   // bindCallEvents(call);
              // } else {
              //   call.decline();
              // }
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
