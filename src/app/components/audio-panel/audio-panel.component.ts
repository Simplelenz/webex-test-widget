import {Component, EventEmitter, OnInit, Output, Input, ViewChild, ElementRef} from '@angular/core';
import {IconConstant} from '../../configurations/IconConstants';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-audio-panel',
  templateUrl: './audio-panel.component.html',
  styleUrls: ['./audio-panel.component.css']
})
export class AudioPanelComponent implements OnInit {
  spark: any;
  call: any;
  participants: any = [];
  isMute = false;

  @Output() closeAudioCallFunction: EventEmitter<any> = new EventEmitter<any>();
  IconConstant: any = IconConstant;

  @ViewChild('selfAudioElem') selfAudioElem: ElementRef;
  @ViewChild('remoteAudioElem') remoteAudioElem: ElementRef;
  @Input() contact: any;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.spark = this.dataService.getSpark();
    if (this.spark.phone.registered) {
      this.bindCallEvents();
    } else {
      this.makeCall();
    }
  }

  closeCall() {
    if (this.call !== undefined) {
      this.call.hangup();
    }
    this.closeAudioCallFunction.emit();
  }

  makeCall() {
    try {
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
      video: false
    };
    this.call = this.spark.phone.dial(this.contact.id, {constraints});

    this.call.on('active', () => {
      this.participants = (this.call.locus.participants);
      console.log(this.participants);
    });

    this.call.on('error', (err) => {
      console.error(err);
      alert(err.stack);
    });

    this.call.once('localMediaStream:change', () => {
      this.selfAudioElem.nativeElement.srcObject = this.call.localMediaStream;
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
            this.remoteAudioElem.nativeElement.srcObject = new MediaStream([track]);
          }
        }
      });
    });

    // Once the call ends, we'll want to clean up our UI a bit
    this.call.on('inactive', () => {
      // Remove the streams from the UI elements
      this.remoteAudioElem.nativeElement.srcObject = undefined;
      this.selfAudioElem.nativeElement.srcObject = undefined;
    });

  }

  muteButton() {
    if (this.isMute) {
      this.isMute = false;
    } else {
      this.isMute = true;
    }
    this.selfAudioElem.nativeElement.muted = (this.isMute);
  }

}
