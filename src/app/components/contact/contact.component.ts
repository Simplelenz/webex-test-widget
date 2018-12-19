import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {IconConstant} from '../../configurations/IconConstants';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  @Input() name = '';
  @Input() isConversationPanel = false;
  @Input() icon;
  @Input() dateTime = '';
  @Input() selected = false;
  @Input() showCheckButton = false;

  @Output() clickCancelFunction: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickViewSelectFunction: EventEmitter<any> = new EventEmitter<any>();

  IconConstant: any = IconConstant;

  constructor() {
  }

  ngOnInit() {
  }

  clickCancel() {
    this.clickCancelFunction.emit();
  }

  clickViewSelect() {
    this.clickViewSelectFunction.emit();
  }
}
