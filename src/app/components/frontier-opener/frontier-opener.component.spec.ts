import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontierOpenerComponent } from './frontier-opener.component';

describe('FrontierOpenerComponent', () => {
  let component: FrontierOpenerComponent;
  let fixture: ComponentFixture<FrontierOpenerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontierOpenerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontierOpenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
