import { Component, OnInit } from '@angular/core';
import {IconConstant} from "../../configurations/IconConstants";

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  IconConstant: any = IconConstant;

  constructor() { }

  ngOnInit() {
  }

}
