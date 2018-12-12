import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioPanelComponent } from './audio-panel.component';

describe('AudioPanelComponent', () => {
  let component: AudioPanelComponent;
  let fixture: ComponentFixture<AudioPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
