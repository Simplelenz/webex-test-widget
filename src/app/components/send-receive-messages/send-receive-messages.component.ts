import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-send-receive-messages',
  templateUrl: './send-receive-messages.component.html',
  styleUrls: ['./send-receive-messages.component.css']
})
export class SendReceiveMessagesComponent implements OnInit {

  @Input() me = false;
  @Input() message = '';
  @Input() name = '';
  @Input() time = '';

  constructor() {
  }

  ngOnInit() {
  }

}
