import {Component, EventEmitter, OnInit, Output, Input, ViewChild, ElementRef} from '@angular/core';
import {IconConstant} from '../../configurations/IconConstants';

@Component({
  selector: 'app-audio-panel',
  templateUrl: './audio-panel.component.html',
  styleUrls: ['./audio-panel.component.css']
})
export class AudioPanelComponent implements OnInit {

  @Output() closeAudioCallFunction: EventEmitter<any> = new EventEmitter<any>();
  IconConstant: any = IconConstant;

  @Input() @ViewChild('videoElem') videoElem: ElementRef;
  @Input() @ViewChild('viewAudioElem') viewAudioElem: ElementRef;

  constructor() {
  }

  ngOnInit() {
  }

  closeCall() {
    this.closeAudioCallFunction.emit();
  }

}
