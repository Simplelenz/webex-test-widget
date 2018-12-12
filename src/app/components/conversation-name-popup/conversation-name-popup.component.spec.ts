import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationNamePopupComponent } from './conversation-name-popup.component';

describe('ConversationNamePopupComponent', () => {
  let component: ConversationNamePopupComponent;
  let fixture: ComponentFixture<ConversationNamePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationNamePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationNamePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
