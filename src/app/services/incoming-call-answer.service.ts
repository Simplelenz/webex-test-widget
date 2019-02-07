import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class IncomingCallAnswerService {

  callState = new Subject<any>();
  showIncomingCallWidget = new Subject<boolean>();

  constructor() {
  }

  setCallState(state) {
    this.callState.next(state);
  }

  getCallState(): any {
    return this.callState;
  }

  setShowIncomingCallWidgetState(state) {
    this.showIncomingCallWidget.next(state);
  }

  getShowIncomingCallWidgetState() {
    return this.showIncomingCallWidget;
  }
}
