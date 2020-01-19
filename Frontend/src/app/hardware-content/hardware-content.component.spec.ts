import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareContentComponent } from './hardware-content.component';

describe('HardwareContentComponent', () => {
  let component: HardwareContentComponent;
  let fixture: ComponentFixture<HardwareContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
