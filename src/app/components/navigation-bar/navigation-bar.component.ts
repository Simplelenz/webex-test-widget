import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TAB} from './tabs.enum';
import {IconConstant} from "../../configurations/IconConstants";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  @Input() visibleTabs = {CONVERSATION: true, CONTACTS: true, VIDEO: false, AUDIO: false};
  @Output() tabChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() goBackPanel: EventEmitter<any> = new EventEmitter<any>();

  tab: any = TAB;
  activatedTab = this.tab.CONVERSATION;
  IconConstant: any = IconConstant;

  constructor() {
  }

  ngOnInit() {
  }

  clickTab(tabNum) {
    this.tabChange.emit(tabNum);
  }

  panelBack() {
    this.goBackPanel.emit();
  }
}
