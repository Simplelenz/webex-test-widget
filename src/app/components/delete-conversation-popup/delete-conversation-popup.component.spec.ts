import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConversationPopupComponent } from './delete-conversation-popup.component';

describe('DeleteConversationPopupComponent', () => {
  let component: DeleteConversationPopupComponent;
  let fixture: ComponentFixture<DeleteConversationPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteConversationPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteConversationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
