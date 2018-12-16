import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IconConstant} from '../../configurations/IconConstants';
import {TAB} from '../navigation-bar/tabs.enum';

@Component({
  selector: 'app-panel-container',
  templateUrl: './panel-container.component.html',
  styleUrls: ['./panel-container.component.css']
})
export class PanelContainerComponent implements OnInit {

  @Input() userName = 'Hello Kevin';
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  IconConstant: any = IconConstant;
  tab: any = TAB;
  panel = this.tab.CONVERSATION;
  showPopUp = false;
  visibleTabs = {CONVERSATION: true, CONTACTS: true, VIDEO: false, AUDIO: false, MESSAGE: false};
  activatedTab = this.tab.CONVERSATION;

  constructor() {
  }

  ngOnInit() {
  }

  clickClose() {
    this.close.emit(false);
  }

  changePanel(tabNum) {
    this.panel = tabNum;
  }

  clickDoneFunctionEmit(popUpData) {
    this.showPopUp = popUpData.popUp;
    if (popUpData.contactList.length === 1) {
      this.visibleTabs = {CONVERSATION: false, CONTACTS: false, VIDEO: false, AUDIO: false, MESSAGE: true};
      this.panel = this.tab.MESSAGE;
      this.activatedTab = this.tab.MESSAGE;
    }
  }

  popUpFunctionEmit(data) {
    if (data.state) {
      if (data.conversationName) {
        this.showPopUp = false;
        this.visibleTabs = {CONVERSATION: false, CONTACTS: false, VIDEO: false, AUDIO: false, MESSAGE: true};
        this.panel = this.activatedTab = this.tab.MESSAGE;
      }
    } else {
      this.showPopUp = false;
    }
  }

  goBackPanelFunction() {
    if (this.panel === this.tab.CONVERSATION || this.panel === this.tab.CONTACTS || this.panel === this.tab.MESSAGE) {
      this.visibleTabs = {CONVERSATION: true, CONTACTS: true, VIDEO: false, AUDIO: false, MESSAGE: false};
      this.panel = this.activatedTab = this.tab.CONVERSATION;
    }
  }
}
