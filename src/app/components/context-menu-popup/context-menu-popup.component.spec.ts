import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuPopupComponent } from './context-menu-popup.component';

describe('ContextMenuPopupComponent', () => {
  let component: ContextMenuPopupComponent;
  let fixture: ComponentFixture<ContextMenuPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextMenuPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
