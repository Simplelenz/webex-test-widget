import {Component, Input, OnInit} from '@angular/core'
import {IconConstant} from '../../configurations/IconConstants';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  @Input() contactName: string = 'No Name';
  IconConstant: any = IconConstant;

  constructor() {
  }

  ngOnInit() {
  }

}
