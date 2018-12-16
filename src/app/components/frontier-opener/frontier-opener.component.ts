import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-frontier-opener',
  templateUrl: './frontier-opener.component.html',
  styleUrls: ['./frontier-opener.component.css']
})
export class FrontierOpenerComponent implements OnInit {

  @Output() showPanelContainer: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  clickFrontierOpener() {
    this.showPanelContainer.emit(true);
  }

}
