import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontierWidgetComponent } from './frontier-widget.component';

describe('FrontierWidgetComponent', () => {
  let component: FrontierWidgetComponent;
  let fixture: ComponentFixture<FrontierWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontierWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontierWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
