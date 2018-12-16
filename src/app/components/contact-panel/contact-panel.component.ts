import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MockService} from '../../services/mock.service';
import {IconConstant} from '../../configurations/IconConstants';

@Component({
  selector: 'app-contact-panel',
  templateUrl: './contact-panel.component.html',
  styleUrls: ['./contact-panel.component.css']
})
export class ContactPanelComponent implements OnInit {

  @Output() clickDoneFunction: EventEmitter<any> = new EventEmitter<any>();

  IconConstant = IconConstant;
  contactList: any = [];
  term = '';
  selectedContactList: any = [];

  constructor(private mockService: MockService) {
    mockService.getMockJson('mocks/contacts.json').subscribe((response => {
      this.contactList = response;
    }), error => {
      console.log(error);
    });
  }

  ngOnInit() {
    this.selectedContactList = [];
  }

  selectContact(i, contact) {

    let temp = true;

    this.selectedContactList.forEach(item => {
      if (contact === item) {
        temp = false;
      }
    });
    if (temp) {
      this.selectedContactList.push(contact);
    }
  }

  clickDone() {
    if (this.selectedContactList.length > 0) {
      if (this.selectedContactList.length > 1) {
        this.clickDoneFunction.emit({popUp: true, contactList: this.selectedContactList});
      } else {
        this.clickDoneFunction.emit({popUp: false, contactList: this.selectedContactList});
      }
    }
  }
}
