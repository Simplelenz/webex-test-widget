import {Directive, HostListener, EventEmitter, Output} from '@angular/core';

@Directive({
  selector: '[pressEnter]'
})
export class PressEnterDirective {

  @Output() pressEnterEmit: EventEmitter<number> = new EventEmitter();

  constructor() {
  }

  @HostListener('document:keypress', ['$event'])
  pressEnter(event) {
    if (event.key === 'Enter') {
      console.log('%c Press enter', 'color:  #5fba7d; font-weight: bold;');
      this.pressEnterEmit.emit();
    }
  }
}
