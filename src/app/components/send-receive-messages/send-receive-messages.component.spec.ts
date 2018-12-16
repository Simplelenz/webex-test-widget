import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendReceiveMessagesComponent } from './send-receive-messages.component';

describe('SendReceiveMessagesComponent', () => {
  let component: SendReceiveMessagesComponent;
  let fixture: ComponentFixture<SendReceiveMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendReceiveMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendReceiveMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
