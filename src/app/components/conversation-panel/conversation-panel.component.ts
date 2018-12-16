import {Component, OnInit} from '@angular/core';
import {IconConstant} from "../../configurations/IconConstants";

@Component({
  selector: 'app-conversation-panel',
  templateUrl: './conversation-panel.component.html',
  styleUrls: ['./conversation-panel.component.css']
})
export class ConversationPanelComponent implements OnInit {

  IconConstant: any = IconConstant;

  constructor() {
  }

  ngOnInit() {
  }

}
