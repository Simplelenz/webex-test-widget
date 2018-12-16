import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IconConstant} from '../../configurations/IconConstants';
import {TAB} from '../navigation-bar/tabs.enum';

@Component({
  selector: 'app-message-panel',
  templateUrl: './message-panel.component.html',
  styleUrls: ['./message-panel.component.css']
})
export class MessagePanelComponent implements OnInit {

  @Output() clickCallFunction: EventEmitter<any> = new EventEmitter<any>();
  tab: any = TAB;
  IconConstant: any = IconConstant;

  constructor() {
  }

  ngOnInit() {
  }

  clickVideoCall() {
    this.clickCallFunction.emit(this.tab.VIDEO);
  }

  clickAudioCall() {
    this.clickCallFunction.emit(this.tab.AUDIO);
  }
}
