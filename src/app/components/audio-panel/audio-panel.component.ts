import {Component, EventEmitter, OnInit, Output, Input, ViewChild, ElementRef} from '@angular/core';
import {IconConstant} from '../../configurations/IconConstants';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-audio-panel',
  templateUrl: './audio-panel.component.html',
  styleUrls: ['./audio-panel.component.css']
})
export class AudioPanelComponent implements OnInit {
  spark: any;

  @Output() closeAudioCallFunction: EventEmitter<any> = new EventEmitter<any>();
  IconConstant: any = IconConstant;

  @ViewChild('audioElem') audioElem: ElementRef;
  @ViewChild('viewAudioElem') viewAudioElem: ElementRef;
  @Input() contact: any;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.spark = this.dataService.getSpark();
    this.makeCall();
  }

  closeCall() {
    this.closeAudioCallFunction.emit();
  }

  makeCall() {
    try {
      this.spark.phone.register();
      const call = this.spark.phone.dial(this.contact.id);
      call.on('connected', () => {
        this.audioElem.nativeElement.srcObject = call.remoteMediaStream;
      });
    } catch (error) {
      console.log(error);
    }
  }

}
