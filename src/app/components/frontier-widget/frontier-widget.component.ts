import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
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
  showIncomingCallPanel = false;
  answeredCall: any;
  callerName: any;

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

    const calling = document.createElement('span');
    calling.textContent = 'is calling...';
    calling.style.color = '#aaaaaa';
    calling.style.padding = '6px';

    const callerName = document.createElement('span');
    callerName.id = 'callerName';
    callerName.style.color = '#ffffff';
    callerName.style.padding = '6px';
    callerName.style.paddingRight = '0px';
    callerName.style.fontWeight = '600';

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
    p.appendChild(callerName);
    p.appendChild(calling);
    p.appendChild(acceptButton);
    p.appendChild(declineButton);

    this.elm.nativeElement.appendChild(div);

    this.incomingCallAnswerService.getShowIncomingCallWidgetState().subscribe((res) => {
      if (res === true) {
        div.style.visibility = 'visible';
        audio.play();
      }
      if (res === false) {
        div.style.visibility = 'hidden';
        audio.pause();
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

      this.spark.phone.on('call:incoming', (call) => {
          Promise.resolve()
            .then(() => {
              if (call.from && call.from.personId) {
                return this.spark.people.get(call.from.personId);
              }

              return Promise.resolve();
            })
            .then((person) => {

              this.incomingCallAnswerService.setShowIncomingCallWidgetState(true);

              const str = person ? `Anwser incoming call from ${person.displayName}` : 'Answer incoming call';

              call.on('inactive', () => {
                this.incomingCallAnswerService.setShowIncomingCallWidgetState(false);
              });

              this.callerName = (person.displayName);
              document.getElementById('callerName').textContent = this.callerName;

              this.incomingCallAnswerService.getCallState().subscribe((res) => {
                if (res === true) {
                  console.log('answer');
                  call.answer();
                  this.answeredCall = call;
                  this.showIncomingCallPanel = true;
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

  closeIncomingCall() {
    if (this.answeredCall) {
      this.answeredCall.hangup();
      this.answeredCall = undefined;
    }
    this.showIncomingCallPanel = false;
  }
}
