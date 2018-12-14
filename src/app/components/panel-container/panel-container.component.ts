import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IconConstant} from "../../configurations/IconConstants";
import {TAB} from "../navigation-bar/tabs.enum";

@Component({
  selector: 'app-panel-container',
  templateUrl: './panel-container.component.html',
  styleUrls: ['./panel-container.component.css']
})
export class PanelContainerComponent implements OnInit {

  @Input() userName: string = 'Hello Kevin';
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  IconConstant: any = IconConstant;
  tab: any = TAB;
  panel = this.tab.CONVERSATION;

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
}
