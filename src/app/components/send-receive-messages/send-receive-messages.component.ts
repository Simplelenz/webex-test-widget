import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-send-receive-messages',
  templateUrl: './send-receive-messages.component.html',
  styleUrls: ['./send-receive-messages.component.css']
})
export class SendReceiveMessagesComponent implements OnInit {

  @Input() me = false;
  @Input() message = 'Hi Buddies, How are you?';
  @Input() name = 'Andrew Bett';
  @Input() time = '10:03 AM';

  constructor() {
  }

  ngOnInit() {
  }

}
