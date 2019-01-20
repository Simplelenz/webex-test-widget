import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-context-menu-popup',
  templateUrl: './context-menu-popup.component.html',
  styleUrls: ['./context-menu-popup.component.css']
})
export class ContextMenuPopupComponent implements OnInit {

  @Input() showPopUp = false;
  @Input() contact: any;
  @Output() clickSpaceEmit: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  clickChat() {
    console.log('click chat in pop up');
  }

  clickCall() {
    console.log('click call in pop up');
  }

  clickVideoCall() {
    console.log('click video call in pop up');
  }

  clickSpace() {
    this.clickSpaceEmit.emit(false);
  }
}
