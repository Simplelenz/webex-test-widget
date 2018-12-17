import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IconConstant} from '../../configurations/IconConstants';
import {MockService} from '../../services/mock.service';
import {HttpService} from '../../services/http.service';

@Component({
  selector: 'app-conversation-panel',
  templateUrl: './conversation-panel.component.html',
  styleUrls: ['./conversation-panel.component.css']
})
export class ConversationPanelComponent implements OnInit {

  @Input() conversationList: any = [];
  @Output() clickNewFunction: EventEmitter<any> = new EventEmitter<any>();
  @Output() viewConversation: EventEmitter<any> = new EventEmitter<any>();

  IconConstant: any = IconConstant;
  term = '';

  constructor(private mockService: MockService, private httpService: HttpService) {
    // mockService.getMockJson('mocks/conversations.json').subscribe((response => {
    //   console.log(response);
    //   this.conversationList = response.items;
    // }), error => {
    //   console.log(error);
    // });
  }

  ngOnInit() {
  }

  clickNew() {
    this.clickNewFunction.emit();
  }

  formatLastActivity(UTC): any {
    return new Date(UTC);
  }

  clickCancelFunctionEmit(contact) {
    console.log(contact);
  }

  selectConversation(contact) {
    this.viewConversation.emit(contact);
  }
}
