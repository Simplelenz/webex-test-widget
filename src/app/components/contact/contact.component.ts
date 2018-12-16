import {Component, Input, OnInit} from '@angular/core'
import {IconConstant} from '../../configurations/IconConstants';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  @Input() name = 'No Name';
  @Input() isConversationPanel = false;
  @Input() icon: string = IconConstant.DEFAULT_MULTIPLE_USER;
  @Input() dateTime = '2018/12/13 3:53PM';

  IconConstant: any = IconConstant;

  constructor() {
  }

  ngOnInit() {
  }

}
