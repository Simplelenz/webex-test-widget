import {Component, OnInit, ElementRef, Input} from '@angular/core';

@Component({
  selector: 'app-frontier-widget',
  templateUrl: './frontier-widget.component.html',
  styleUrls: ['./frontier-widget.component.css']
})
export class FrontierWidgetComponent implements OnInit {

  @Input() email: string;
  showPanelContainer = false;
  isSuccess: boolean;
  showContextMenu = true;
  showContextPopUp = false;
  avatarContact: any;
  contextPanelData: any;

  constructor(private elm: ElementRef) {
    this.email = elm.nativeElement.getAttribute('email');
  }

  ngOnInit() {
  }

  showHidePanelContainer(event) {
    this.contextPanelData = undefined;
    this.showPanelContainer = event;
    this.showContextMenu = !event;
  }

  isAuthSuccess(event) {
    this.isSuccess = event;
    return this.isSuccess;
  }

  contextPopUp(event) {
    this.showContextPopUp = event;
  }

  setAvatarContact(contact) {
    this.avatarContact = contact;
  }

  emitConversation(conversation) {
    this.showContextMenu = false;
    this.showPanelContainer = true;
    this.contextPanelData = {'contact': this.avatarContact, 'conversation': conversation};
  }
}
