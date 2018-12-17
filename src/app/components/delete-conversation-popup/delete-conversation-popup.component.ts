import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-delete-conversation-popup',
  templateUrl: './delete-conversation-popup.component.html',
  styleUrls: ['./delete-conversation-popup.component.css']
})
export class DeleteConversationPopupComponent implements OnInit {
  @Output() deletePopUpFunction: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  deletePopUpEvents(btn) {
    if (btn === 'Yes') {
      this.deletePopUpFunction.emit(true);
    }
    if (btn === 'No') {
      this.deletePopUpFunction.emit(false);
    }
  }
}
