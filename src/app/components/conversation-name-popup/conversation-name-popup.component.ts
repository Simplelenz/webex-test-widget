import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-conversation-name-popup',
  templateUrl: './conversation-name-popup.component.html',
  styleUrls: ['./conversation-name-popup.component.css']
})
export class ConversationNamePopupComponent implements OnInit {

  @Output() popUpFunction: EventEmitter<any> = new EventEmitter<any>();

  conversationName = '';

  constructor() {
  }

  ngOnInit() {
  }

  popUpEvents(btn) {
    if (btn === 'Done') {
      this.popUpFunction.emit({state: true, conversationName: this.conversationName});
    }
    if (btn === 'Cancel') {
      this.popUpFunction.emit({state: false, conversationName: this.conversationName});
    }
  }
}
