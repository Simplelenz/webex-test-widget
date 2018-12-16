import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IconConstant} from "../../configurations/IconConstants";

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  @Output() searchText: EventEmitter<any> = new EventEmitter<any>();

  IconConstant: any = IconConstant;
  term: string = '';

  constructor() {
  }

  ngOnInit() {
  }

  goSearch() {
    this.searchText.emit(this.term);
  }
}
