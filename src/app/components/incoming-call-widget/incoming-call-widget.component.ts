import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IncomingCallAnswerService} from "../../services/incoming-call-answer.service";

@Component({
  selector: 'app-incoming-call-widget',
  templateUrl: './incoming-call-widget.component.html',
  styleUrls: ['./incoming-call-widget.component.css']
})
export class IncomingCallWidgetComponent implements OnInit {

  constructor(private incomingCallAnswerService: IncomingCallAnswerService) {
  }

  ngOnInit() {
  }

  incomingCallFunction(state) {
    this.incomingCallAnswerService.setCallState(state);
  }
}
