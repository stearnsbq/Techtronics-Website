import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontPageContentComponent } from './front-page-content.component';

describe('FrontPageContentComponent', () => {
  let component: FrontPageContentComponent;
  let fixture: ComponentFixture<FrontPageContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontPageContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontPageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
