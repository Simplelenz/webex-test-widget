import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IconConstant} from '../../configurations/IconConstants';

@Component({
  selector: 'app-video-panel',
  templateUrl: './video-panel.component.html',
  styleUrls: ['./video-panel.component.css']
})
export class VideoPanelComponent implements OnInit {

  @Output() closeVideoCallFunction: EventEmitter<any> = new EventEmitter<any>();
  IconConstant: any = IconConstant;

  constructor() {
  }

  ngOnInit() {
  }

  closeCall() {
    this.closeVideoCallFunction.emit();
  }

}
