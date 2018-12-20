import {Component, OnInit} from '@angular/core';
import {interval} from 'rxjs/observable/interval';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  timeOut = true;

  constructor() {
    setTimeout(() => this.timeOut = false, 3000);
  }

  ngOnInit() {
  }

}
