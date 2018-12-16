import {Component, OnInit} from '@angular/core';
import {IconConstant} from "../../configurations/IconConstants";
import {URL} from "../../configurations/UrlConstants";
import {RequestMethod, RequestOptions} from "@angular/http";
import {HttpService} from "../../services/http.service";

@Component({
  selector: 'app-conversation-panel',
  templateUrl: './conversation-panel.component.html',
  styleUrls: ['./conversation-panel.component.css']
})
export class ConversationPanelComponent implements OnInit {

  IconConstant: any = IconConstant;
  contactList: any = [];
  term = '';

  constructor(private httpService: HttpService) {
  }

  ngOnInit() {
    this.getAllConversations();
  }

  getAllConversations() {
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
