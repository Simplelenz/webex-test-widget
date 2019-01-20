import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {URL} from "../../configurations/UrlConstants";
import {RequestMethod, RequestOptions} from "@angular/http";
import {HttpService} from "../../services/http.service";

@Component({
  selector: 'app-context-menu-panel',
  templateUrl: './context-menu-panel.component.html',
  styleUrls: ['./context-menu-panel.component.css']
})
export class ContextMenuPanelComponent implements OnInit {

  @Output() clickAvatarEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() avatarContactEmit: EventEmitter<any> = new EventEmitter<any>();

  contactList: any = [];

  constructor(private httpService: HttpService) {
    this.getAllContacts();
  }

  ngOnInit() {
  }

  clickAvatar(contact) {
    this.clickAvatarEmit.emit(true);
    this.avatarContactEmit.emit(contact);
  }

  getAllContacts() {
    const options = new RequestOptions();
    options.url = URL.WEBEX_API_BASE + URL.ROOMS;
    options.method = RequestMethod.Get;

    this.httpService.request(options).subscribe((response => {
      const temp: any = JSON.parse(response['_body']);
      this.contactList = temp.items.filter((item) => {
        return item.type === 'direct';
      });

    }), error => {
      console.log(error);
    });
  }

  getIcon(i): number {
    return (i.toString().split('')[i.toString().split('').length - 1]);
  }
}
