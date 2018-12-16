import {Component, OnInit} from '@angular/core';
import {MockService} from "../../services/mock.service";
import {IconConstant} from '../../configurations/IconConstants';

@Component({
  selector: 'app-contact-panel',
  templateUrl: './contact-panel.component.html',
  styleUrls: ['./contact-panel.component.css']
})
export class ContactPanelComponent implements OnInit {

  IconConstant = IconConstant;
  contactList: any = [];
  term: string = '';
  selectedContactList: any = [];

  constructor(private mockService: MockService) {
    mockService.getMockJson('mocks/contacts.json').subscribe((response => {
      this.contactList = response;
    }), error => {
      console.log(error);
    })
  }

  ngOnInit() {
  }

  selectContact(i, contact) {
    this.selectedContactList.push(contact);
  }
}
