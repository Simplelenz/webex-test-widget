import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MockService} from '../../services/mock.service';
import {IconConstant} from '../../configurations/IconConstants';
import {URL} from '../../configurations/UrlConstants';
import {HttpService} from '../../services/http.service';
import {RequestMethod, RequestOptions} from '@angular/http';

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

  constructor(private mockService: MockService, private httpService: HttpService) {
    mockService.getMockJson('mocks/contacts.json').subscribe((response => {
      this.contactList = response;
    }), error => {
      console.log(error);
    });
  }

  ngOnInit() {
    this.selectedContactList = [];
    this.getAllContacts();
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

  getAllContacts() {
    const options = new RequestOptions();
    options.url = URL.WEBEX_API_BASE + 'v1/rooms';
    options.method = RequestMethod.Get;

    this.httpService.request(options).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );

  }
}
