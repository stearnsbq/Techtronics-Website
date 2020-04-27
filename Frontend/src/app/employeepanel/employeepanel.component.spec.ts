import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeepanelComponent } from './employeepanel.component';

describe('EmployeepanelComponent', () => {
  let component: EmployeepanelComponent;
  let fixture: ComponentFixture<EmployeepanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeepanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeepanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
