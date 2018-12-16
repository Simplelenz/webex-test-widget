import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IconConstant} from '../../configurations/IconConstants';

@Component({
  selector: 'app-audio-panel',
  templateUrl: './audio-panel.component.html',
  styleUrls: ['./audio-panel.component.css']
})
export class AudioPanelComponent implements OnInit {

  @Output() closeAudioCallFunction: EventEmitter<any> = new EventEmitter<any>();
  IconConstant: any = IconConstant;

  constructor() {
  }

  ngOnInit() {
  }

  closeCall() {
    this.closeAudioCallFunction.emit();
  }

}
