import {Component, Input, OnInit} from '@angular/core';
import {IconConstant} from '../../configurations/IconConstants';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css']
})
export class IconComponent implements OnInit {

  @Input() faIconString: string = IconConstant.DEFAULT_ICON;

  constructor() {
  }

  ngOnInit() {
  }

}
