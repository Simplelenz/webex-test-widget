import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-incoming-call-widget',
  templateUrl: './incoming-call-widget.component.html',
  styleUrls: ['./incoming-call-widget.component.css']
})
export class IncomingCallWidgetComponent implements OnInit {

  @Output() incomingCallStateEmit: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  incomingCallFunction(state) {
    this.incomingCallStateEmit.emit(state);
  }
}
