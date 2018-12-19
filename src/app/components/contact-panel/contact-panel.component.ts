import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MockService} from '../../services/mock.service';
import {IconConstant} from '../../configurations/IconConstants';

@Component({
  selector: 'app-contact-panel',
  templateUrl: './contact-panel.component.html',
  styleUrls: ['./contact-panel.component.css']
})
export class ContactPanelComponent implements OnInit {

  @Output() clickDoneFunction: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedContacts: EventEmitter<any> = new EventEmitter<any>();
  @Input() contactList: any = [];
  @Input() showDoneButton = false;

  IconConstant = IconConstant;
  term = '';
  selectedContactList: any = [];

  constructor(private mockService: MockService) {
    // mockService.getMockJson('mocks/contacts.json').subscribe((response => {
    //   this.contactList = response;
    // }), error => {
    //   console.log(error);
    // });
  }

  ngOnInit() {
  }

  selectContact(i, contact) {

    let temp = true;

    this.selectedContactList.forEach(item => {
      if (contact === item) {
        this.selectedContactList.splice(this.selectedContactList.indexOf(contact), 1);
        temp = false;
      }
    });
    if (temp) {
      this.selectedContactList.push(contact);
    }
    this.selectedContacts.emit(this.selectedContactList);
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

  isSelectedContact(contact): any {
    let temp = false;
    this.selectedContactList.forEach(item => {
      if (contact === item) {
        temp = true;
      }
    });
    return temp;
  }

  formatLastActivity(UTC): any {
    return new Date(UTC);
  }
}
