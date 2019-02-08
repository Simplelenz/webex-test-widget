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

  @ViewChild('selfAudioElem') selfAudioElem: ElementRef;
  @ViewChild('remoteAudioElem') remoteAudioElem: ElementRef;

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

              this.bindIncomingCallEvents(call);
              this.incomingCallAnswerService.setShowIncomingCallWidgetState(true);

              const str = person ? `Anwser incoming call from ${person.displayName}` : 'Answer incoming call';

              this.incomingCallAnswerService.getCallState().subscribe((res) => {
                if (res === true) {
                  console.log('answer');
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

  bindIncomingCallEvents(call) {
    call.on('error', (err) => {
      console.error(err);
      alert(err.stack);
    });

    call.once('localMediaStream:change', () => {
      this.selfAudioElem.nativeElement.srcObject = call.localMediaStream;
    });

    call.on('remoteMediaStream:change', () => {
      [
        'audio',
        'video'
      ].forEach((kind) => {
        if (call.remoteMediaStream) {
          const track = call.remoteMediaStream.getTracks().find((t) => t.kind === kind);
          if (track) {
            this.remoteAudioElem.nativeElement.srcObject = new MediaStream([track]);
          }
        }
      });
    });

    call.on('inactive', () => {
      this.incomingCallAnswerService.setShowIncomingCallWidgetState(false);
      this.remoteAudioElem.nativeElement.srcObject = undefined;
      this.selfAudioElem.nativeElement.srcObject = undefined;
    });

  }
}
