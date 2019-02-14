import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IconConstant} from '../../configurations/IconConstants';
import {IncomingCallAnswerService} from '../../services/incoming-call-answer.service';

@Component({
  selector: 'app-incoming-call-panel',
  templateUrl: './incoming-call-panel.component.html',
  styleUrls: ['./incoming-call-panel.component.css']
})
export class IncomingCallPanelComponent implements OnInit {

  IconConstant: any = IconConstant;
  isMute = false;

  panelContainer: any;
  frontierOpener: any;
  contextMenu: any;
  contextMenuPopUp: any;

  @Output() closeIncomingCallEmit: EventEmitter<any> = new EventEmitter();
  @Input() answeredCall: any;
  @Input() callerName: any;

  @ViewChild('self') self: ElementRef;
  @ViewChild('remoteVideo') remoteVideo: ElementRef;
  @ViewChild('remoteAudio') remoteAudio: ElementRef;

  constructor(private incomingCallAnswerService: IncomingCallAnswerService) {
  }

  ngOnInit() {
    this.panelContainer = document.getElementById('panelContainer');
    this.frontierOpener = document.getElementById('frontierOpener');
    this.contextMenu = document.getElementById('contextMenu');
    this.contextMenuPopUp = document.getElementById('contextMenuPopUp');

    if (this.panelContainer) {
      this.panelContainer.style.display = 'none';
    }

    if (this.frontierOpener) {
      this.frontierOpener.style.display = 'none';
    }

    if (this.contextMenu) {
      this.contextMenu.style.display = 'none';
    }

    if (this.contextMenuPopUp) {
      this.contextMenuPopUp.style.display = 'none';
    }

    this.answeredCall.answer();
    this.bindIncomingCallEvents(this.answeredCall);
  }

  muteButton() {
    if (this.isMute) {
      this.isMute = false;
    } else {
      this.isMute = true;
    }
    this.self.nativeElement.muted = (this.isMute);
  }

  closeCall() {
    this.closeIncomingCallEmit.emit();

    if (this.panelContainer) {
      this.panelContainer.style.display = 'unset';
    }

    if (this.frontierOpener) {
      this.frontierOpener.style.display = 'unset';
    }

    if (this.contextMenu) {
      this.contextMenu.style.display = 'unset';
    }

    if (this.contextMenuPopUp) {
      this.contextMenuPopUp.style.display = 'unset';
    }
  }

  bindIncomingCallEvents(call) {
    call.on('error', (err) => {
      console.error(err);
      alert(err.stack);
    });

    call.once('localMediaStream:change', () => {
      this.self.nativeElement.srcObject = call.localMediaStream;
    });

    call.on('remoteMediaStream:change', () => {
      [
        'audio',
        'video'
      ].forEach((kind) => {
        if (call.remoteMediaStream) {
          const track = call.remoteMediaStream.getTracks().find((t) => t.kind === kind);
          if (track) {
            if (kind === 'audio') {
              this.remoteAudio.nativeElement.srcObject = new MediaStream([track]);
            }
            if (kind === 'video') {
              this.remoteVideo.nativeElement.srcObject = new MediaStream([track]);
            }
          }
        }
      });
    });

    call.on('inactive', () => {
      this.incomingCallAnswerService.setShowIncomingCallWidgetState(false);
      this.closeCall();
      this.self.nativeElement.srcObject = undefined;
      this.remoteAudio.nativeElement.srcObject = undefined;
      this.remoteVideo.nativeElement.srcObject = undefined;
    });
  }
}
