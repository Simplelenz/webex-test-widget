import {Component, OnInit, ElementRef, Input} from '@angular/core';
import {DataService} from "../../services/data.service";

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
  spark: any;

  constructor(private elm: ElementRef, private dataService: DataService) {
    this.email = elm.nativeElement.getAttribute('email');
    this.spark = this.dataService.getSpark();
  }

  ngOnInit() {
    console.log('frontier init');
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
