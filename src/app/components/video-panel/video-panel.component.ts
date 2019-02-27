import {Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, Input} from '@angular/core';
import {IconConstant} from '../../configurations/IconConstants';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-video-panel',
  templateUrl: './video-panel.component.html',
  styleUrls: ['./video-panel.component.css']
})
export class VideoPanelComponent implements OnInit {
  spark: any;
  call: any;
  isMute = false;
  participants: any = [];

  @Output() closeVideoCallFunction: EventEmitter<any> = new EventEmitter<any>();
  IconConstant: any = IconConstant;

  @ViewChild('selfVideoElem') selfVideoElem: ElementRef;
  @ViewChild('remoteVideoElem') remoteVideoElem: ElementRef;
  @ViewChild('remoteAudioElem') remoteAudioElem: ElementRef;
  @Input() contact: any;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.makeCall();
  }

  closeCall() {
    if (this.call !== undefined) {
      this.call.hangup();
    }
    this.closeVideoCallFunction.emit();
  }

  makeCall() {
    try {
      this.spark = this.dataService.getSpark();
      this.spark.phone.register()
        .then(() => {
          this.bindCallEvents();
        });

    } catch (error) {
      console.log(error);
    }
  }

  bindCallEvents() {
    const constraints = {
      audio: true,
      video: true
    };
    this.call = this.spark.phone.dial(this.contact.id, {constraints});

    this.call.on('active', () => {
      const videoParticipants = document.getElementById('videoParticipants');
      this.participants = (this.call.locus.participants);
      console.log(this.participants);
      (this.participants).forEach((participant) => {
        const participants = document.createElement('li');
        const status = document.createElement('span');
        status.className = 'status active';
        const participantName = document.createElement('span');
        participantName.textContent = participant.person.name;
        if (participants) {
          participants.appendChild(status);
          participants.appendChild(participantName);
        }
        if (videoParticipants) {
          videoParticipants.appendChild(participants);
        }
      });
    });

    this.call.on('error', (err) => {
      console.error(err);
      alert(err.stack);
    });

    this.call.once('localMediaStream:change', () => {
      this.selfVideoElem.nativeElement.srcObject = this.call.localMediaStream;
    });

    this.call.on('remoteMediaStream:change', () => {
      // Ok, yea, this is a little weird. There's a Chrome behavior that prevents
      // audio from playing from a video tag if there is no corresponding video
      // track.
      [
        'audio',
        'video'
      ].forEach((kind) => {
        if (this.call.remoteMediaStream) {
          const track = this.call.remoteMediaStream.getTracks().find((t) => t.kind === kind);
          if (track) {
            if (kind === 'audio') {
              this.remoteAudioElem.nativeElement.srcObject = new MediaStream([track]);
            }
            if (kind === 'video') {
              this.remoteVideoElem.nativeElement.srcObject = new MediaStream([track]);
            }
          }
        }
      });
    });

    // Once the call ends, we'll want to clean up our UI a bit
    this.call.on('inactive', () => {
      // Remove the streams from the UI elements
      this.selfVideoElem.nativeElement.srcObject = undefined;
      this.remoteVideoElem.nativeElement.srcObject = undefined;
      this.remoteAudioElem.nativeElement.srcObject = undefined;
      this.closeCall();
    });

  }

  muteButton() {
    if (this.isMute) {
      this.isMute = false;
      this.call.startSendingAudio();
      this.call.startSendingVideo();
    } else {
      this.isMute = true;
      this.call.stopSendingAudio();
      this.call.stopSendingVideo();
    }
    this.selfVideoElem.nativeElement.muted = (this.isMute);
    // this.remoteVideoElem.nativeElement.muted = (this.isMute);
  }
}
