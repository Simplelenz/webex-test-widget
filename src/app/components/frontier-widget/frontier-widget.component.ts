import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-frontier-widget',
  templateUrl: './frontier-widget.component.html',
  styleUrls: ['./frontier-widget.component.css']
})
export class FrontierWidgetComponent implements OnInit {

  showPanelContainer: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  showHidePanelContainer(event) {
    this.showPanelContainer = event;
  }
}
